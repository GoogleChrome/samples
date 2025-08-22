import {
  FilesetResolver,
  LlmInference,
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/genai_bundle.mjs';
import { fileOpen } from 'https://cdn.jsdelivr.net/npm/browser-fs-access@latest/dist/index.modern.js';
import { get, set } from 'https://cdn.jsdelivr.net/npm/idb-keyval@latest/+esm';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@latest/lib/marked.esm.js';
import fetchInChunks from 'https://cdn.jsdelivr.net/npm/fetch-in-chunks@latest/index.js';

const input = document.querySelector('textarea');
const output = document.querySelector('output');
const button = document.querySelector('.disk');
const download = document.querySelector('.download');
const cancel = document.querySelector('.cancel');
const progress = document.querySelector('progress');
const form = document.querySelector('form');
const submit = document.querySelector('[type=submit]');
const reset = document.querySelector('[type=reset]');
const error = document.querySelector('.error');
const span = document.querySelector('.busy');
const info = document.querySelector('.cached');

const GEMMA_URL =
  'https://storage.googleapis.com/jmstore/kaggleweb/grader/g-2b-it-gpu-int4.bin';

let modelBlobURL = null;
let genAI = null;

let initRan = false;
let controller;

input.addEventListener('keydown', (event) => {
  if (event.code === 'Enter' && !event.shiftKey) {
    if (!event.repeat) {
      const newEvent = new Event('submit', { cancelable: true });
      event.target.form.dispatchEvent(newEvent);
    }
    event.preventDefault();
  }
});

const storeFileInIDB = async (blob) => {
  try {
    performance.mark('start-idb-cache');
    await set('model.bin', blob);
    performance.mark('end-idb-cache');
    const mark = performance.measure(
      'idb-cache',
      'start-idb-cache',
      'end-idb-cache'
    );
    console.log(
      'Model file cached in IDB.',
      mark.name,
      mark.duration.toFixed(2)
    );
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const storeFileInOPFS = async (blob) => {
  try {
    performance.mark('start-opfs-cache');
    const root = await navigator.storage.getDirectory();
    const handle = await root.getFileHandle('model.bin', { create: true });
    const writable = await handle.createWritable();
    await blob.stream().pipeTo(writable);
    performance.mark('end-opfs-cache');
    const mark = performance.measure(
      'opfs-cache',
      'start-opfs-cache',
      'end-opfs-cache'
    );
    console.log(
      'Model file cached in OPFS.',
      mark.name,
      mark.duration.toFixed(2)
    );
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const storeFileInSWCache = async (blob) => {
  try {
    performance.mark('start-sw-cache-cache');
    const modelCache = await caches.open('models');
    await modelCache.put('model.bin', new Response(blob));
    performance.mark('end-sw-cache-cache');
    const mark = performance.measure(
      'sw-cache-cache',
      'start-sw-cache-cache',
      'end-sw-cache-cache'
    );
    console.log(
      'Model file cached in sw-cache.',
      mark.name,
      mark.duration.toFixed(2)
    );
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const storeFileHandleInIDB = async (handle) => {
  try {
    performance.mark('start-file-handle-cache');
    await set('model.bin.handle', handle);
    performance.mark('end-file-handle-cache');
    const mark = performance.measure(
      'file-handle-cache',
      'start-file-handle-cache',
      'end-file-handle-cache'
    );
    console.log(
      'Model file handle cached in IDB.',
      mark.name,
      mark.duration.toFixed(2)
    );
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const restoreFileFromIDB = async () => {
  try {
    performance.mark('start-idb-restore');
    const file = await get('model.bin');
    if (!file) {
      throw new Error('File model.bin not found in IDB.');
    }
    performance.mark('end-idb-restore');
    const mark = performance.measure(
      'idb-restore',
      'start-idb-restore',
      'end-idb-restore'
    );
    console.log(
      'Cached model file found in IDB.',
      mark.name,
      mark.duration.toFixed(2)
    );
    modelBlobURL = URL.createObjectURL(file);
    return 'IndexedDB';
  } catch (err) {
    throw err;
  }
};

const restoreFileFromOPFS = async () => {
  try {
    performance.mark('start-opfs-restore');
    const root = await navigator.storage.getDirectory();
    const handle = await root.getFileHandle('model.bin');
    const file = await handle.getFile();
    performance.mark('end-opfs-restore');
    const mark = performance.measure(
      'opfs-restore',
      'start-opfs-restore',
      'end-opfs-restore'
    );
    console.log(
      'Cached model file found in OPFS.',
      mark.name,
      mark.duration.toFixed(2)
    );
    modelBlobURL = URL.createObjectURL(file);
    return 'Origin Private File System';
  } catch (err) {
    throw err;
  }
};

const restoreFileFromSWCache = async () => {
  try {
    performance.mark('start-sw-cache-restore');
    const modelCache = await caches.open('models');
    const response = await modelCache.match('model.bin');
    if (!response) {
      throw new Error(`File model.bin not found in sw-cache.`);
    }
    const file = await response.blob();
    performance.mark('end-sw-cache-restore');
    const mark = performance.measure(
      'sw-cache-restore',
      'start-sw-cache-restore',
      'end-sw-cache-restore'
    );
    console.log(
      'Cached model file found in sw-cache.',
      mark.name,
      mark.duration.toFixed(2)
    );
    modelBlobURL = URL.createObjectURL(file);
    return 'Service Worker Cache';
  } catch (err) {
    throw err;
  }
};

const restoreFileFromFileHandle = async () => {
  try {
    performance.mark('start-file-handle-restore');
    const handle = await get('model.bin.handle');
    if (!handle) {
      throw new Error('File model.bin.handle not found in OPFS.');
    }
    if ((await handle.queryPermission()) !== 'granted') {
      const decision = await handle.requestPermission();
      if (decision === 'denied' || decision === 'prompt') {
        return Promise.reject();
      }
    }
    const file = await handle.getFile();
    performance.mark('end-file-handle-restore');
    const mark = performance.measure(
      'file-handle-restore',
      'start-file-handle-restore',
      'end-file-handle-restore'
    );
    console.log(
      'Cached model file handle found in IDB.',
      mark.name,
      mark.duration.toFixed(2)
    );
    modelBlobURL = URL.createObjectURL(file);
    return 'FileSystemFileHandle';
  } catch (err) {
    throw err;
  }
};

const init = async () => {
  if (initRan) {
    return;
  }
  initRan = true;
  genAI = await FilesetResolver.forGenAiTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm'
  );
  input.focus();
  input.selectionEnd = input.value.length;
  const winner = await Promise.any([
    restoreFileFromOPFS(),
    restoreFileFromIDB(),
    restoreFileFromSWCache(),
    restoreFileFromFileHandle(),
  ]).catch((_) => {
    console.log('No cached model found.');
  });
  if (winner) {
    info.textContent = `Cached model found in ${winner}.`;
  }
};

document.addEventListener(
  'click',
  () => {
    init();
  },
  { once: true }
);

document.addEventListener(
  'pointermove',
  () => {
    init();
  },
  { once: true }
);

button.addEventListener('click', async () => {
  try {
    const blob = await fileOpen({
      extensions: ['.bin'],
      mimeTypes: ['application/octet-stream'],
      description: 'LLM model files',
    });

    modelBlobURL = URL.createObjectURL(blob);

    await Promise.any([
      storeFileInOPFS(blob),
      storeFileInIDB(blob),
      storeFileInSWCache(blob),
      blob.handle ? storeFileHandleInIDB(blob.handle) : Promise.resolve(),
    ]);
    const persisted = await navigator.storage.persist();
    console.log('Storage persisted', persisted);
  } catch (err) {
    if (err.name !== 'AbortError') {
      showError(err.message);
    }
  }
});

download.addEventListener('click', async () => {
  try {
    progress.value = 0;
    progress.style.display = 'inline-block';
    cancel.hidden = false;

    controller = new AbortController();
    const signal = controller.signal;

    const blob = await fetchInChunks(GEMMA_URL, {
      chunkSize: 5 * 1024 * 1024,
      maxParallelRequests: 10,
      progressCallback: (done, total) => (progress.value = done / total),
      signal,
    });
    modelBlobURL = URL.createObjectURL(blob);

    await Promise.any([
      storeFileInOPFS(blob),
      storeFileInIDB(blob),
      storeFileInSWCache(blob),
    ]);
    const persisted = await navigator.storage.persist();
    console.log('Storage persisted', persisted);
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err.name, err.message);
    }
  } finally {
    progress.style.display = 'none';
    cancel.hidden = true;
  }
});

cancel.addEventListener('click', () => {
  controller.abort();
});

form.addEventListener('reset', (e) => {
  e.preventDefault();
  output.innerHTML = '';
  input.value = '';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!('gpu' in navigator)) {
    return alert(
      "MediaPipe LLM requires the WebGPU API, which isn't supported in your browser."
    );
  }
  if (!modelBlobURL) {
    showError('Load a model first!');
    return;
  }

  span.textContent = 'Generating response…';
  const llmInference = await LlmInference.createFromOptions(genAI, {
    baseOptions: {
      modelAssetPath: modelBlobURL,
    },
    maxTokens: 1000,
    topK: 40,
    temperature: 0.8,
    randomSeed: Math.round(Math.random() * 1000),
  });

  const inputPrompt = input.value;

  let result = '';
  const section = document.createElement('section');
  output.append(section);
  llmInference.generateResponse(inputPrompt, (partialResult, done) => {
    result += partialResult;
    section.innerHTML = marked.parse(result);
    if (done) {
      span.textContent = '';
    }
  });
});

const showError = (message) => {
  error.textContent = message;
  setTimeout(() => {
    error.textContent = '';
  }, 3000);
};
