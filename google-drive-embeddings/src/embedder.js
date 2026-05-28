/**
 * Manager class that encapsulates background Web Worker execution for Semantic AI Embeddings.
 * Offloads heavy mathematical operations from the main UI thread to prevent layout freezes.
 */

let worker = null;
let pendingResolver = null;
let pendingRejecter = null;
let activeProgressCallback = null;
let isModelInitializedState = false;

/**
 * Instantiates the background Web Worker inside Vite and registers its message routing systems
 */
function getWorker() {
  if (worker) return worker;

  // Spawns standard background thread Web Worker parsed standardly by Vite
  worker = new Worker(new URL('./embedder.worker.js', import.meta.url), { type: 'module' });

  worker.onmessage = (e) => {
    const { type, status, percent, message, embeddings, results, values, error } = e.data;

    if (type === 'progress') {
      if (activeProgressCallback) {
        activeProgressCallback({ status, percent, message });
      }
    }

    else if (type === 'status' && status === 'ready') {
      isModelInitializedState = true;
      if (activeProgressCallback) {
        activeProgressCallback({ status: 'ready', message });
      }
      if (pendingResolver) {
        pendingResolver(true);
        pendingResolver = null;
        pendingRejecter = null;
      }
    }

    else if (type === 'complete') {
      if (pendingResolver) {
        pendingResolver(embeddings);
        pendingResolver = null;
        pendingRejecter = null;
      }
    }

    else if (type === 'searchResults') {
      if (pendingResolver) {
        pendingResolver(results);
        pendingResolver = null;
        pendingRejecter = null;
      }
    }

    else if (type === 'embedTextResult') {
      if (pendingResolver) {
        pendingResolver(values);
        pendingResolver = null;
        pendingRejecter = null;
      }
    }

    else if (type === 'error') {
      isModelInitializedState = false;
      if (pendingRejecter) {
        pendingRejecter(new Error(message || 'Web Worker operational error'));
        pendingResolver = null;
        pendingRejecter = null;
      }
    }
  };

  return worker;
}

/**
 * Command: Instructs the worker to initialize the model backend.
 */
export async function initEmbedder(onProgress) {
  const w = getWorker();
  activeProgressCallback = onProgress;

  return new Promise((resolve, reject) => {
    pendingResolver = resolve;
    pendingRejecter = reject;
    w.postMessage({ type: 'init' });
  });
}

/**
 * Command: Instructs the worker to calculate embeddings for an array of tracks.
 */
export async function calculateEmbeddings(tracks, onProgress) {
  const w = getWorker();
  activeProgressCallback = onProgress;

  const textsToEmbed = tracks.map(t => `Artist: ${t.artist} | Title: ${t.title}`);

  return new Promise((resolve, reject) => {
    pendingResolver = resolve;
    pendingRejecter = reject;
    w.postMessage({ type: 'calculate', payload: { texts: textsToEmbed } });
  });
}

/**
 * Command: Instructs the worker to run similarity comparisons and return scored results.
 */
export async function searchTracks(queryText, tracks, trackEmbeddings) {
  const w = getWorker();

  return new Promise((resolve, reject) => {
    pendingResolver = resolve;
    pendingRejecter = reject;
    w.postMessage({ type: 'search', payload: { queryText, tracks, trackEmbeddings } });
  });
}

/**
 * Command: Instructs the worker to generate a vector signature for a single text.
 */
export async function embedText(text, options = {}) {
  const w = getWorker();

  return new Promise((resolve, reject) => {
    // Wrap returned value inside our mock standard format block expected by main.js
    pendingResolver = (values) => resolve({ embeddings: [{ values }] });
    pendingRejecter = reject;
    w.postMessage({ type: 'embedText', payload: { text, options } });
  });
}

/**
 * Returns whether the AI model is ready in the background.
 */
export function isModelLoaded() {
  return isModelInitializedState;
}

/**
 * Override flag for session restores
 */
export function setModelLoaded(loaded) {
  isModelInitializedState = loaded;
}
