/**
 * Semantic Embedder helper for calculating text vector embeddings and running cosine similarity search.
 * Backed by the updated built-in-ai-task-apis-polyfills which internally offloads model processing
 * and heavy calculations to its own background Web Worker.
 */

let embedder = null;

/**
 * Initializes the SemanticEmbedder, downloading model weights if needed.
 */
export async function initEmbedder(onProgress) {
  if (embedder) {
    onProgress({ status: 'ready', message: 'Model is already loaded.' });
    return embedder;
  }

  // Load the polyfill dynamically if not already present globally
  if (!('SemanticEmbedder' in window)) {
    onProgress({ status: 'loading-polyfill', message: 'Loading Built-in AI polyfill module...' });
    await import('built-in-ai-task-apis-polyfills/semantic-embedder');
  }

  onProgress({ status: 'initializing', message: 'Initializing model backend...' });

  try {
    embedder = await window.SemanticEmbedder.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          // e.loaded is a float representing the fraction (0.0 to 1.0)
          const percent = Math.round((e.loaded || 0) * 100);
          onProgress({
            status: 'downloading',
            percent,
            message: `Downloading model weights (~420MB)... ${percent}%`
          });
        });
      }
    });

    onProgress({ status: 'ready', message: 'Semantic AI Model is fully loaded and ready!' });
    return embedder;
  } catch (err) {
    console.error('Failed to initialize SemanticEmbedder:', err);
    onProgress({ status: 'error', message: `Error loading model: ${err.message}` });
    throw err;
  }
}

/**
 * Calculates embeddings for an array of approved tracks in sequential batches.
 * Batching keeps the client responsive and reports incremental progress steps.
 */
export async function calculateEmbeddings(tracks, onProgress) {
  if (!embedder) {
    throw new Error('Embedder is not initialized.');
  }

  const total = tracks.length;
  const embeddingsList = [];
  if (total === 0) return [];

  // Generate clean document representation for each track
  const textsToEmbed = tracks.map(t => `Artist: ${t.artist} | Title: ${t.title}`);
  
  // Dynamic chunk processing to keep UI thread responsive and report progress steps
  const batchSize = 5;
  for (let i = 0; i < total; i += batchSize) {
    const chunk = textsToEmbed.slice(i, i + batchSize);
    const progressPercent = Math.round((i / total) * 100);

    onProgress({
      current: i,
      total,
      percent: progressPercent,
      message: `Calculating vectors: ${i} / ${total} tracks indexed...`
    });

    try {
      const chunkResult = await embedder.embed(chunk, { taskType: 'document' });
      chunkResult.embeddings.forEach((emb) => {
        embeddingsList.push(emb.values);
      });
    } catch (err) {
      console.error(`Failed to embed batch starting at index ${i}:`, err);
      // Fill failed entries with null to maintain index alignment
      chunk.forEach(() => embeddingsList.push(null));
    }
  }

  onProgress({
    current: total,
    total,
    percent: 100,
    message: `All ${total} tracks successfully indexed!`
  });

  return embeddingsList;
}

/**
 * Runs vector search querying over our track collection using cosine similarity.
 */
export async function searchTracks(queryText, tracks, trackEmbeddings) {
  if (!queryText.trim() || !embedder || trackEmbeddings.length === 0) {
    return tracks.map(t => ({ ...t, score: 0 }));
  }

  try {
    const queryResult = await embedder.embed(queryText, { taskType: 'query' });
    const queryVec = queryResult.embeddings[0].values;

    const scoredTracks = tracks.map((track, idx) => {
      const docVec = trackEmbeddings[idx];
      let score = 0;
      
      if (docVec) {
        score = window.SemanticEmbedder.cosineSimilarity(queryVec, docVec);
      }
      
      return {
        ...track,
        score: score
      };
    });

    return scoredTracks.sort((a, b) => b.score - a.score);
  } catch (err) {
    console.error('Error during semantic search:', err);
    return tracks.map(t => ({ ...t, score: 0 }));
  }
}

/**
 * Embeds a single text or text array dynamically.
 */
export async function embedText(text, options = {}) {
  if (!embedder) {
    throw new Error('Semantic AI model is not loaded in memory.');
  }
  return await embedder.embed(text, options);
}

/**
 * Returns whether the Gemma model has been loaded into memory.
 */
export function isModelLoaded() {
  return embedder !== null;
}
