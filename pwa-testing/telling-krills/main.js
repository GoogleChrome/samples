'use strict';

function addKrill() {
  const image = document.createElement('img');
  image.src = 'http://cdn.glitch.com/c605c71d-22d0-48c7-b85a-7611786324cb%2Ftelling-krills.png';
  document.body.appendChild(image);
}

async function main() {
  await navigator.serviceWorker.register('serviceworker.js');

  button.addEventListener('click', _ => {
    addKrill();
    setInterval(addKrill, 1000);
  });
}

main();