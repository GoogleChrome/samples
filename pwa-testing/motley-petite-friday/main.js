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


window.addEventListener("beforeinstallprompt", (e) => {
  printLn("Received beforeinstallprompt event.");
  e.userChoice.then((userChoice) => {
    printLn("User chose '" + userChoice.outcome + "'.");
  });
  printLn("Calling prompt automatically.");
  e.prompt();
});

main();