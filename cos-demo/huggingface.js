import {
  pipeline,
  env,
} from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3';
import { getBlobHash } from './util.js';

const pre = document.querySelector('pre');
const output = document.querySelector('output');

const cachedFileHashesLocalStorageKey = 'cached-file-hashes';
const cachedFileHashes = JSON.parse(
  localStorage.getItem(cachedFileHashesLocalStorageKey) ?? '{}',
);

/**
 * Event logging.
 */
Blob.prototype.toString = function () {
  return `Blob {
  size: ${this.size} bytes,
  type: "${this.type || 'application/octet-stream'}",
}`;
};

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = (...args) => {
  originalConsoleLog.apply(console, args);
  const message = args
    .map((arg) =>
      arg instanceof Blob
        ? arg.toString()
        : typeof arg === 'string'
          ? arg
          : JSON.stringify(arg, null, 2),
    )
    .join(' ');
  pre.append(document.createTextNode(message + '\n\n'));
};

console.error = (...args) => {
  originalConsoleError.apply(console, args);
  const message = args
    .map((arg) =>
      arg instanceof Blob
        ? arg.toString()
        : typeof arg === 'string'
          ? arg
          : JSON.stringify(arg, null, 2),
    )
    .join(' ');
  if (/onnxruntime/.test(message)) {
    return;
  }
  const span = document.createElement('span');
  span.append(message + '\n\n');
  pre.append(span);
};

// Gets the SHA-256 hash for large resources as per
// https://huggingface.co/docs/hub/en/storage-backends#xet.
const getSHA256Hash = async (request) => {
  if (/\/resolve\/main\/onnx\//.test(request)) {
    request = request.replace(/\/resolve\//, '/raw/');
    const text = await fetch(request).then((response) => response.text());
    const hash = text.replace(/.*?\n^oid sha256:(\w+)\n.*?$/gm, '$1');
    return hash;
  }
};

env.useBrowserCache = false;
env.useCustomCache = true;
env.customCache = {
  match: async (request) => {
    const hashValue =
      cachedFileHashes[request] || (await getSHA256Hash(request));
    if (!hashValue) {
      return undefined;
    }
    const hash = { algorithm: 'SHA-256', value: hashValue };
    console.log('Trying to access file in cross-origin storage...', hash);
    try {
      const [handle] = await navigator.crossOriginStorage.requestFileHandles([
        hash,
      ]);
      const blob = await handle.getFile();
      console.log('File found in cross-origin storage:', blob);
      return new Response(blob);
    } catch (err) {
      console.error(err.name, err.message);
      return undefined;
    }
  },
  put: async (request, response) => {
    const blob = await response.blob();
    const hash = await getBlobHash(blob);
    cachedFileHashes[request] = hash.value;
    localStorage.setItem(
      cachedFileHashesLocalStorageKey,
      JSON.stringify(cachedFileHashes),
    );
    const [handle] = await navigator.crossOriginStorage.requestFileHandles(
      [hash],
      { create: true },
    );
    const writableStream = await handle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
    console.log('File stored in cross-origin storage:', blob);
  },
};

// Create automatic speech recognition pipeline
const transcriber = await pipeline(
  'automatic-speech-recognition',
  'onnx-community/whisper-tiny.en',
  { device: 'webgpu' },
);

// Transcribe audio from a URL
const url =
  'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
const transcription = await transcriber(url);
output.innerHTML = '';
output.append(JSON.stringify(transcription));
// { text: ' And so my fellow Americans ask not what your country can do for you, ask what you can do for your country.' }
