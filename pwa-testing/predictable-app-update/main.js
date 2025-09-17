'use strict';

let iconSizes = [32, 64, 128, 256, 512];
let whiteIcons = [
  '32x32.png',
  '64x64.png',
  '128x128.png',
  '256x256.png',
  '512x512.png',
];
let redIcons = [
  '32x32-red.png',
  '64x64-red.png',
  '128x128-red.png',
  '256x256-red.png',
  '512x512-red.png',
];
let altIcons = [
  '32x32-alt.png',
  '64x64-alt.png',
  '128x128-alt.png',
  '256x256-alt.png',
  '512x512-alt.png',
];

// Change from White to Alt to trigger silent manifest icon update changes.
const IconTypes = {
  White: 0,
  Red: 1,
  Alt: 2,
};

let iconType;
let themeColor;

// Dynamically change manifest fields like security and non-security
// sensitive fields to verify predictable app updating.
// Does not support scope changes yet.
async function main() {
  console.log('main: Awaiting service worker...');
  await navigator.serviceWorker.register('serviceworker.js');
  await navigator.serviceWorker.ready;

  console.log('main: Awaiting manifest read...');
  console.log('main: Checking LocalStorage');

  let manifest = readLocalStorageForManifest();
  let metadata = readLocalStorageForMetadata();
  if (!metadata) {
    iconType = IconTypes.White;
    themeColor = 'green';
  } else {
    iconType = metadata.iconType;
    themeColor = metadata.themeColor;
  }

  if (!manifest) {
    console.log('main: No manifest in LocalStorage, fallback to construction');
    manifest = constructManifestFromPage();
  }
  console.log('main: Manifest read complete, updating all storages');

  updateServiceWorker(manifest);
  updateLocalStorage(manifest, constructManifestMetadata(manifest));
  updateDisplay(manifest);

  for (let select of document.querySelectorAll('select')) {
    select.addEventListener('change', updateManifestFromSite);
  }

  console.log('main: Done!');
}

// Construct manifest dynamically from the inputs on the page.
function constructManifestFromPage() {
  let manifest = {
    name: document.getElementById('appName').value,
    description: 'Test app to verify manifest updates being predictable',
    display: 'standalone',
    scope: './',
    start_url: './',
    theme_color: document.getElementById('themeColorSelect').value,
    icons: [],
  };

  let i = 0;
  iconSizes.forEach((iconSize) => {
    let inputValue = document.getElementById('appIcon').value;

    let iconsToUse = whiteIcons;
    if (inputValue === 'white_icons') {
      iconType = IconTypes.White;
      iconsToUse = whiteIcons;
    } else if (inputValue === 'red_icons') {
      iconType = IconTypes.Red;
      iconsToUse = redIcons;
    } else if (inputValue === 'alt_icons') {
      iconType = IconTypes.Alt;
      iconsToUse = altIcons;
    }

    let value = iconsToUse[i++];
    let purpose = 'any';
    if (iconSize === 256) {
      purpose = 'any maskable';
    }
    if (value !== 'None') {
      manifest.icons.push({
        src: value,
        sizes: iconSize + 'x' + iconSize,
        type: 'image/png',
        purpose: purpose,
      });
    }
  });

  return manifest;
}

// Update the service worker to provide the changed manifest.
function updateServiceWorker(manifest) {
  navigator.serviceWorker.ready.then((registration) => {
    console.log('ready ', registration, navigator.serviceWorker);
  });

  if (!navigator.serviceWorker.controller) {
    console.log('updateServiceWorker: SW update failed.');
    console.log(navigator.serviceWorker);
    return;
  }
  navigator.serviceWorker.controller.postMessage(manifest);
  console.log('updateServiceWorker: SW updated.');
  console.log('Manifest:', manifest);
}

// Update the manifest in the local storage to store information across sessions for the same site.
function updateLocalStorage(manifest, metadata) {
  localStorage.setItem('manifest', JSON.stringify(manifest));
  localStorage.setItem('metadata', JSON.stringify(metadata));
  console.log('localStorage updated.');
}

// Read from local storage to get information about sessions back.
function readLocalStorageForManifest() {
  return JSON.parse(localStorage.getItem('manifest'));
}

function readLocalStorageForMetadata() {
  return JSON.parse(localStorage.getItem('metadata'));
}

function updateDisplay(manifest) {
  // Update the title of the page based on the manifest.
  document.getElementById('title').textContent = manifest.name;

  // Update the selection fields based on the manifest.
  document.getElementById('appName').value = manifest.name;
  document.getElementById('appIcon').value = ConvertIconTypeToInput();
  document.getElementById('themeColorSelect').value = manifest.theme_color;

  // Update the page icon based on the manifest.
  document.getElementById('pageIcon').src = GetIconFromType();

  // Update the theme of the manifest output area based on the manifest.
  document.getElementById('output').style.background = manifest.theme_color;

  // Hack to make text colors white on black background.
  if (manifest.theme_color === 'black') {
    document.getElementById('output').style.color = 'white';
  } else {
    document.getElementById('output').style.color = 'black';
  }
  output.textContent = JSON.stringify(manifest, null, 2);
}

// Construct the manifest based on inputs from the page, send to service worker and cache them in local storage and on display.
function updateManifestFromSite() {
  console.log('updateManifestFromSite: reading changes');
  const manifest = constructManifestFromPage();
  updateServiceWorker(manifest);
  updateLocalStorage(manifest, constructManifestMetadata(manifest));
  updateDisplay(manifest);
  console.log('updateManifestFromSite: changes parsed');
}

// Helper functions to make behavior on the page easier to understand.
function GetIconFromType() {
  switch (iconType) {
    case IconTypes.White:
      return '256x256.png';
    case IconTypes.Red:
      return '256x256-red.png';
    case IconTypes.Alt:
      return '256x256-alt.png';
  }
}

function ConvertIconTypeToInput() {
  switch (iconType) {
    case IconTypes.White:
      return 'white_icons';
    case IconTypes.Red:
      return 'red_icons';
    case IconTypes.Alt:
      return 'alt_icons';
  }
}

function constructManifestMetadata(manifest) {
  let metadata = {};
  metadata.themeColor = manifest.theme_color;
  metadata.iconType = iconType === null ? IconTypes.White : iconType;
  return metadata;
}

main();
