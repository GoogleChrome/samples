'use strict';

function print(text) {
  output.textContent += text;
}

function printLn(text) {
  print(text + '\n');
}

async function main() {
  try {
    printLn('Start.');

    print('Registering service worker...');
    await navigator.serviceWorker.register('serviceworker.js')
    printLn('success.');

    printLn('End.');
  } catch (e) {
    printLn('Oh noes: ' + e);
  }
}

main();