"use strict";

async function main() {
  await navigator.serviceWorker.register("serviceworker.js", { scope: "./" });
  await navigator.serviceWorker.ready;
}

async function stopRedirection() {
  await navigator.serviceWorker.register("serviceworker.js", { scope: "./" });
  await navigator.serviceWorker.ready;
  navigator.serviceWorker.controller.postMessage({
      redirect: false,
  });
}

async function startRedirection() {
  await navigator.serviceWorker.register("serviceworker.js", { scope: "./" });
  await navigator.serviceWorker.ready;
  navigator.serviceWorker.controller.postMessage({
      redirect: true,
  });
}

main();
