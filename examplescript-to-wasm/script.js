import Parser from './parser.js';
import Compiler from './compiler.js';
import { fileSave } from 'https://unpkg.com/browser-fs-access@0.35.0/dist/index.modern.js';

const parser = new Parser();
const compiler = new Compiler();

const button = document.querySelector('.convert-button');
const save = document.querySelector('.save-button');
const textarea = document.querySelector('textarea');
const unoptimized = document.querySelector('.unoptimized');
const optimized = document.querySelector('.optimized');

let wasmData;

button.addEventListener('click', () => {
  try {
    const parsed = parser.parse(textarea.value);
    console.log('Parsed input:\n', parsed);

    let wasm = compiler.compile(parsed);
    let textData = wasm.emitText();
    unoptimized.innerHTML = `<pre><code>${textData}</code></pre>`;
    console.log('Unoptimized Wasm:\n', textData);

    wasm = compiler.optimize(wasm);
    textData = wasm.emitText();
    optimized.innerHTML = `<pre><code>${textData}</code></pre>`;
    console.log('Optimized Wasm:\n', textData);

    wasmData = wasm.emitBinary();
    const compiled = new WebAssembly.Module(wasmData);
    const instance = new WebAssembly.Instance(compiled, {});
    console.log('Wasm exports:\n', instance.exports);
    for (const [name, func] of Object.entries(instance.exports)) {
      console.log(`${name}(10, 5) = ${func(10, 5)}`);
    }
  } catch (err) {
    alert(err);
  }
});

save.addEventListener('click', async () => {
  if (!wasmData) {
    return;
  }
  wasmData = new Blob([wasmData], {type: 'application/binary'});
  try {    
    await fileSave(wasmData, {
      fileName: 'examplescript.wasm',
      extensions: ['.wasm'],
    });
  } catch(err) {
    console.error(err.name, err.message);
  }
});
