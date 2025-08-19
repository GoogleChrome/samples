import { fileSave } from 'https://unpkg.com/browser-fs-access@0.31.0/dist/index.modern.js';

const button = document.querySelector('button');

if ('CompressionStream' in window) {
  button.addEventListener('click', async () => {
    const readableStream = await fetch('lorem.txt').then(
      (response) => response.body
    );
    const compressedReadableStream = readableStream.pipeThrough(
      new CompressionStream('gzip')
    );
    await fileSave(new Response(compressedReadableStream), {
      fileName: 'lorem.gz',
      extensions: ['.gz'],
    });
  });
} else {
  button.addEventListener('click', () => {
    alert("Your browser doesn't support the CompressionStream API.");
  });
}
