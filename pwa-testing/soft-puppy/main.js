'use strict';

function print(text) {
  output.textContent += text + '\n';
}

const period = 4000;
const timeOffset = Math.random() * period;
function updateColour(time = 0) {
  const hue = 360 * (time + timeOffset) / period | 0;
  themeColor.content = `hsl(${hue}, 100%, 75%)`;
  document.body.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
  requestAnimationFrame(updateColour);
}

async function main() {
  print('Start of script.');

  try {
    await navigator.serviceWorker.register('serviceworker.js');
    print('Service Worker registered.');
  } catch (e) {
    print('Oh noes: ' + e);
  }
  
  print('Starting colour update loop.');
  updateColour();
  
  print('Registering appinstalled event');
  window.addEventListener('appinstalled', event => {
    print('App installed');
    window.appinstalledEvent = event;
  });

  print('End of script.');
}

main();