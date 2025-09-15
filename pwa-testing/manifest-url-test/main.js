"use strict";

let iconSizes = [32, 64, 128, 256, 512];
let whiteIcons = [
  "32x32.png",
  "64x64.png",
  "128x128.png",
  "256x256.png",
  "512x512.png",
];
let redIcons = [
  "32x32-red.png",
  "64x64-red.png",
  "128x128-red.png",
  "256x256-red.png",
  "512x512-red.png",
];
let altIcons = [
  "32x32-alt.png",
  "64x64-alt.png",
  "128x128-alt.png",
  "256x256-alt.png",
  "512x512-alt.png",
];

async function main() {
  console.log("main: Awaiting service worker...");
  await navigator.serviceWorker.register("serviceworker.js");
  await navigator.serviceWorker.ready;
  
  console.log("main: Awaiting manifest read...");
  console.log("main: Checking LocalStorage");

  let manifest = readLocalStorageForManifest();
  if(!manifest) {
    console.log("main: No manifest in LocalStorage, fallback to construction");
    manifest = constructManifest();
  }
  console.log("main: Manifest read complete, updating areas");

  updateServiceWorker(manifest);
  updateLocalStorage(manifest);
  updateDisplay(manifest);

  for (let select of document.querySelectorAll("select")) {
    select.addEventListener("change", updateManifestFromSite);
  }
  
  console.log("main: Done!");
}

// Construct manifest dynamically.
function constructManifest() {
  let manifest = {
    name: document.getElementById('appName').value,
    description: "Test app to verify manifest updates being predictable",
    display: "standalone",
    scope: "./",
    start_url: "./",
    icons: []
  };

  let i = 0;
  iconSizes.forEach(iconSize => {
    let value = whiteIcons[i++];
    let purpose = "any"
    if(iconSize === 256) {
        purpose = "any maskable"
    }
    if (value !== "None") {
      manifest.icons.push({
        src: value,
        sizes: iconSize + "x" + iconSize,
        type: "image/png",
        purpose: purpose
      });
    }
  })

  return manifest;
}

// Update the service worker to provide the changed manifest dynamically.
function updateServiceWorker(manifest) {
  navigator.serviceWorker.ready.then((registration) => {
    console.log('ready ', registration, navigator.serviceWorker);
  });

  if (!navigator.serviceWorker.controller) {
    console.log("updateServiceWorker: SW update failed.");
    console.log(navigator.serviceWorker);
    return;
  }
  navigator.serviceWorker.controller.postMessage(manifest);
  console.log("updateServiceWorker: SW updated.");
  console.log('Manifest:', manifest);
}

// Update the manifest in the local storage to store information across sessions.
function updateLocalStorage(manifest) {
  localStorage.setItem("manifest", JSON.stringify(manifest));
  console.log("localStorage updated.");
}

function readLocalStorageForManifest() {
  return JSON.parse(localStorage.getItem("manifest"));
}

function updateDisplay(manifest) {
  document.getElementById('title').textContent = manifest.name;
  document.getElementById('appName').value = manifest.name;
}

function updateManifestFromSite() {
  console.log("updateManifestFromSite: reading changes");
  const manifest = constructManifest();
  updateServiceWorker(manifest);
  updateLocalStorage(manifest);
  updateDisplay(manifest);
  console.log("updateManifestFromSite: changes parsed");
}

main();