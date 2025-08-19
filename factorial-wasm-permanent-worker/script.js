const input = document.querySelector('input');
const output = document.querySelector('output');
const button = document.querySelector('button');

const modulePromise = WebAssembly.compileStreaming(fetch('factorial.wasm'));

let worker = null;

const blobURL = URL.createObjectURL(
  new Blob(
    [
      `
let instance = null;

self.addEventListener('message', async (e) => {
  // Extract the \`WebAssembly.Module\` from the message.
  const {integer, module} = e.data;
  const importObject = {};
  // Instantiate the Wasm module that came via \`postMessage()\`.
  instance = instance || await WebAssembly.instantiate(module, importObject);  
  const factorial = instance.exports.factorial;
  const result = factorial(integer);
  self.postMessage({result});
});
`,
    ],
    { type: 'text/javascript' }
  )
);

button.addEventListener('click', async (e) => {
  if (!worker) {
    worker = new Worker(blobURL);

    worker.addEventListener('message', (e) => {
      output.textContent = e.data.result;
      performance.mark('stop');
      const measure = performance.measure('Calculation', 'start', 'stop');
      console.log(measure.name, measure.duration);
    });
  }
  performance.mark('start');
  e.preventDefault();
  const integer = parseInt(input.value, 10);
  if (integer > 20 || integer < 0) {
    return alert('Please use a value between 0 and 20.');
  }
  worker.postMessage({
    integer,
    module: await modulePromise,
  });
});
