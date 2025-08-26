'use strict';

function addKrill() {
  const image = document.createElement('img');
  image.src = 'telling-krills.png';
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