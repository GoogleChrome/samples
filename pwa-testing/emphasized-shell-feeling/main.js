'use strict';

function print(text) {
  output.textContent += text;
}

function printLn(text) {
  print(text + '\n');
}

async function main() {
  printLn('Start.');

  await registerServiceWorker();
  printLn('End.');
}

async function registerServiceWorker() {
  try {
    print('Registering service worker...');
    await navigator.serviceWorker.register('serviceworker.js')
    printLn('success.');

  } catch (e) {
    printLn('Oh noes: ' + e);
  }
}

main();