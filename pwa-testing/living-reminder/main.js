'use strict';

function print(text) {
  output.textContent += text + '\n';
}

async function main() {
  print('Start of script.');

  try {
    await navigator.serviceWorker.register('serviceworker.js')
    print('Service Worker Registered');
  } catch (e) {
    print('Oh noes: ' + e);
  }

  print('End of script.');
}

main();