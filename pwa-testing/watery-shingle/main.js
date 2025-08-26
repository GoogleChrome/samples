'use strict';

function print(text) {
  output.textContent += text + '\n';
}

async function main() {
  try {
    print('Start.');

    print('Registering service worker...');
    await navigator.serviceWorker.register('serviceworker.js')
    print('Success.');

    print('Requesting geolocation...');
    await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    print('Success.');

    print('End.');
  } catch (e) {
    print('Oh noes: ' + e);
  }
}

main();