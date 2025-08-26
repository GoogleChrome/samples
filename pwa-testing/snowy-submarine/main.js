'use strict';

function print(text) {
  output.textContent += text + '\n';
}

async function main() {
  print('Start of script.');

  try {
    await navigator.serviceWorker.register('serviceworker.js')
    print('Service Worker registered.');
  } catch (e) {
    print('Oh noes: ' + e);
  }
  
  fullscreenButton.onclick = () => {
    document.documentElement.requestFullscreen();
  };
  
  print('End of script.');
}

main();