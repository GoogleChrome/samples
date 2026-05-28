/**
 * Web Worker for running the Gemma-300M SemanticEmbedder calculations in a background thread.
 * Offloads heavy matrix operations and download streams from the main rendering loop.
 */

let embedder = null;
let SemanticEmbedderClass = null;

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type === 'init') {
    try {
      if (embedder) {
        self.postMessage({ type: 'status', status: 'ready', message: 'Model is already loaded.' });
        return;
      }

      // Load polyfill module inside the worker context and extract its named or global module references
      self.postMessage({ type: 'progress', status: 'loading-polyfill', message: 'Loading Built-in AI polyfill module...' });
      const module = await import('built-in-ai-task-apis-polyfills/semantic-embedder');
      SemanticEmbedderClass = module.SemanticEmbedder || module.default || self.SemanticEmbedder || globalThis.SemanticEmbedder;

      if (!SemanticEmbedderClass) {
        throw new Error('SemanticEmbedder class could not be loaded from the polyfill module or global scope.');
      }

      self.postMessage({ type: 'progress', status: 'initializing', message: 'Initializing model backend...' });

      embedder = await SemanticEmbedderClass.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (event) => {
            // event.loaded is a fraction from 0.0 to 1.0 representing overall progress
            const percent = Math.round((event.loaded || 0) * 100);
            self.postMessage({
              type: 'progress',
              status: 'downloading',
              percent,
              message: `Downloading model weights (~420MB)... ${percent}%`
            });
          });
        }
      });

      self.postMessage({ type: 'status', status: 'ready', message: 'Model loaded successfully!' });
    } catch (err) {
      console.error('Worker model initialization error:', err);
      self.postMessage({ type: 'error', message: `Initialization failed: ${err.message}` });
    }
  }

  else if (type === 'calculate') {
    const { texts } = payload;
    const total = texts.length;
    const embeddingsList = [];

    if (total === 0) {
      self.postMessage({ type: 'complete', embeddings: [] });
      return;
    }

    const batchSize = 5;
    try {
      for (let i = 0; i < total; i += batchSize) {
        const chunk = texts.slice(i, i + batchSize);
        const progressPercent = Math.round((i / total) * 100);

        self.postMessage({
          type: 'progress',
          status: 'indexing',
          percent: progressPercent,
          message: `Calculating vectors: ${i} / ${total} tracks indexed...`
        });

        const chunkResult = await embedder.embed(chunk, { taskType: 'document' });
        // Retrieve vector arrays
        chunkResult.embeddings.forEach((emb) => {
          embeddingsList.push(emb.values);
        });
      }

      // Gather Transferable ArrayBuffers to transfer raw ownership instantly without copying memory!
      const transferables = embeddingsList.map(vec => vec ? vec.buffer : null).filter(Boolean);

      self.postMessage({
        type: 'complete',
        embeddings: embeddingsList
      }, transferables);

    } catch (err) {
      console.error('Worker batch indexing error:', err);
      self.postMessage({ type: 'error', message: `Indexing failed: ${err.message}` });
    }
  }

  else if (type === 'search') {
    const { queryText, tracks, trackEmbeddings } = payload;
    try {
      if (!queryText.trim() || !embedder || trackEmbeddings.length === 0) {
        self.postMessage({ type: 'searchResults', results: tracks.map(t => ({ ...t, score: 0 })) });
        return;
      }

      // Calculate query vector signature
      const queryResult = await embedder.embed(queryText, { taskType: 'query' });
      const queryVec = queryResult.embeddings[0].values;

      // Score each track using cosine similarity
      const scoredTracks = tracks.map((track, idx) => {
        const docVec = trackEmbeddings[idx];
        let score = 0;
        
        if (docVec) {
          score = SemanticEmbedderClass.cosineSimilarity(queryVec, docVec);
        }
        
        return {
          ...track,
          score
        };
      });

      // Sort descending by similarity score
      const sortedResults = scoredTracks.sort((a, b) => b.score - a.score);
      self.postMessage({ type: 'searchResults', results: sortedResults });
    } catch (err) {
      console.error('Worker search calculation error:', err);
      self.postMessage({ type: 'error', message: `Search failed: ${err.message}` });
    }
  }

  else if (type === 'embedText') {
    const { text, options } = payload;
    try {
      const result = await embedder.embed(text, options);
      const values = result.embeddings[0].values;
      
      // Transfer underlying buffer array to main thread instantly
      self.postMessage({ type: 'embedTextResult', values }, [values.buffer]);
    } catch (err) {
      console.error('Worker single text embedding error:', err);
      self.postMessage({ type: 'error', message: `Single embedding failed: ${err.message}` });
    }
  }
};
