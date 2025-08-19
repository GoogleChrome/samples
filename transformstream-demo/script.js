const pre = document.querySelector('pre');
const button = document.querySelector('button')

class UpperCaseTransformStream {
  constructor() {
    return new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk.toUpperCase());
      },
    });
  }
}

button.addEventListener('click', async () => {
  const response = await fetch('./script.js');
  const readableStream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new UpperCaseTransformStream());

  const reader = readableStream.getReader();
  pre.textContent = "";
  while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      pre.textContent += value;
  }
});