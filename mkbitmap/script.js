import loadWASM from './mkbitmap.js';
import PBMImage from './pbmimage.js';

const blurInput = document.querySelector('[name=blur]');
const filterInput = document.querySelector('[name=filter]');
const scaleInput = document.querySelector('[name=scale]');
const thresholdInput = document.querySelector('[name=threshold]');
const invertCheckbox = document.querySelector('[name=invert]');
const noFilterCheckbox = document.querySelector('[name=no-filter]');
const noThresholdCheckbox = document.querySelector('[name=no-threshold]');
const cubicRadio = document.querySelector('[value=cubic]');
const linearRadio = document.querySelector('[value=linear]');
const fileInput = document.querySelector('[type=file]');
const img = document.querySelector('img');

const pre = document.querySelector('pre');
const footer = document.querySelector('footer');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const inputImage = 'input.bmp';
const outputImage = 'output.pbm';

let buffer;

const process = async (buffer) => {
  const Module = await loadWASM();
  Module.FS.writeFile(inputImage, new Uint8Array(buffer));

  if (Module.FS.analyzePath(outputImage).exists) {
    Module.FS.unlink(outputImage);
  }

  try {
    const options = [
      '-o',
      outputImage,
      inputImage,
      '-s',
      scaleInput.value,
      cubicRadio.checked ? '-3' : '-1',
    ];
    if (blurInput.value > 0) {
      options.push('-b', blurInput.value);
    }
    if (!noFilterCheckbox.checked) {
      options.push('-f', filterInput.value);
    }
    if (!noThresholdCheckbox.checked) {
      options.push('-t', thresholdInput.value);
    }
    if (invertCheckbox.checked) {
      options.push('-i');
    }
    pre.textContent = `mkbitmap ${options
      .join(' \\\n  ')
      .replaceAll(/\\\n\s+(-?[\d+|+o])/g, '$1')}`;
    Module.callMain(options);

    const output = Module.FS.readFile(outputImage, { encoding: 'binary' });
    const file = new File([output], outputImage, {
      type: 'image/x-portable-bitmap',
    });

    const image = new PBMImage(await file.text());
    const imageData = image.getImageData();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
  } catch (err) {
    console.error(err.name, err.message);
  }
};

[blurInput, filterInput, scaleInput, thresholdInput].forEach((input) => {
  input.nextElementSibling.textContent = input.value;
});

[
  blurInput,
  filterInput,
  scaleInput,
  thresholdInput,
  invertCheckbox,
  noThresholdCheckbox,
  noFilterCheckbox,
  cubicRadio,
  linearRadio,
].forEach((input) => {
  input.addEventListener('change', async () => {
    if (input.name === 'no-filter') {
      filterInput.disabled = input.checked;
    }
    if (input.name === 'no-threshold') {
      thresholdInput.disabled = input.checked;
    }
    if (input.type === 'range') {
      input.nextElementSibling.textContent = input.value;
    }
    await process(buffer);
  });
});

fileInput.addEventListener('change', async () => {
  const file = await fileInput.files[0];
  img.src = URL.createObjectURL(file);
  buffer = await file.arrayBuffer();
  await process(buffer);
});

(async () => {
  // Populate the footer based on `mkbitmap -v`.
  let consoleOutput = 'Powered by ';
  const Module = await loadWASM({        
    print: (text) => (consoleOutput += text),
  });
  Module.callMain(['-v']);
  footer.innerHTML = consoleOutput.replace(
    /(mkbitmap)/,
    '<a href="https://potrace.sourceforge.net/$1.1.html" target="_blank">$1</a>'
  );

  buffer = await fetch(img.src).then((res) => res.arrayBuffer());
  await process(buffer);
})();
