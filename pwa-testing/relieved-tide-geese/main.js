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

var promptEvent = null;

installButton.addEventListener("click", (e) => {
  if (promptEvent != null) {
    printLn("Calling prompt().")
    promptEvent.prompt();
    installButton.disabled = true
  }
  promptEvent = null
});

window.addEventListener("beforeinstallprompt", (e) => {
  printLn("Received beforeinstallprompt event.");
  promptEvent = e;
  e.preventDefault();
  e.userChoice.then((userChoice) => {
    printLn("User chose '" + userChoice.outcome + "'.");
  });
  installButton.disabled = false
});

main();