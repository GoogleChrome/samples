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

    print('Setting beforeunload event.');
    window.onbeforeunload = event => {
      event.preventDefault();
      event.returnValue = 'Leave?';
    }

    print('End.');
  } catch (e) {
    print('Oh noes: ' + e);
  }
}

main();