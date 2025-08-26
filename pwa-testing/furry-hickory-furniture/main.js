"use strict";

function print(text) {
  output.textContent += text;
}

function printLn(text) {
  print(text + "\n");
}

function createManifest(name, scope, start_url) {
  let manifest = {
    name: name,
    display: "minimal-ui",
    start_url: start_url,
    theme_color: hashStringToColor(name),
    background_color: hashStringToColor(name + "background"),
    scope: scope,
    icons: [
      {
        src:
          "2020_07_10_Kleki.png",
        sizes: "256x256",
        type: "image/png"
      }
    ],
    "screenshots" : [
      {
        "src": "Screen%20Shot%202022-07-07%20at%2011.52.52%20AM.png",
        "sizes": "1280x720",
        "type": "image/png",
        "platform": "wide",
        "label": "Homescreen of Awesome App"
      },
      {
        "src": "Screen%20Shot%202022-07-07%20at%2011.52.46%20AM.png",
        "sizes": "1280x720",
        "type": "image/png",
        "platform": "wide",
        "label": "List of Awesome Resources available in Awesome App"
      }
    ]
  };
  return manifest;
}

async function main() {
  printLn("Start.");

  print("Awaiting service worker...");
  await navigator.serviceWorker.register("serviceworker.js");
  await navigator.serviceWorker.ready;
  printLn("done.");

  let manifest = readLSManifest();
  let manifestUrl = readLSManifestUrl();
  printLn(manifest ? "LS manifest found." : "No LS manifest.");

  if (!manifest) {
    manifest = readControlsManifest();
    manifestUrl = manifestUrlSelect.value;
    printLn("Read controls manifest.");
  }

  updateSWAndManifestLink(manifest, manifestUrl);
  updateLS(manifest, manifestUrl);
  updateControls(manifest, manifestUrl);
  updateDisplay(manifest, manifestUrl);

  for (let select of document.querySelectorAll("select")) {
    select.addEventListener("change", controlsChanged);
  }

  printLn("End.");
}

function readLSManifest() {
  try {
    return JSON.parse(localStorage.getItem("manifest"));
  } catch {
    return undefined;
  }
}

function readLSManifestUrl() {
  return localStorage.getItem("manifestUrl");
}

function readControlsManifest() {
  let name =
    "murl: " +
    manifestUrlSelect.value +
    ", surl: " +
    startUrlSelect.value +
    ", scope: " +
    scopeSelect.value +
    "}";
  let hasId = idSelect.value != "None";
  if (hasId) name = "id: " + idSelect.value + ", " + name;
  name = "Manifest: {" + name;
  let manifest = createManifest(name, scopeSelect.value, startUrlSelect.value);
  if (hasId) manifest.id = idSelect.value;
  return manifest;
}

function updateDisplay(manifest, manifestUrl) {
  console.log(manifest);
  title.textContent = manifest.name;
  icon.src = manifest.icons[0].src;
  icon.style.borderColor = manifest.theme_color;
  manifestUrlOutput.textContent = manifestUrl;
  manifestOutput.textContent = JSON.stringify(manifest, null, 2);
  printLn("Display updated.");
}

function updateControls(manifest, manifestUrl) {
  if (manifest.id != undefined) idSelect.value = manifest.id;
  startUrlSelect.value = manifest.start_url;
  scopeSelect.value = manifest.scope;
  manifestUrlSelect.value = manifestUrl;
  printLn("Controls updated.");
}

function updateLS(manifest, manifestUrl) {
  localStorage.setItem("manifest", JSON.stringify(manifest));
  localStorage.setItem("manifestUrl", manifestUrl);
  printLn("LS updated.");
}

function updateSWAndManifestLink(manifest, manifestUrl) {
  if (!navigator.serviceWorker.controller) {
    printLn("SW update failed.");
    return;
  }
  navigator.serviceWorker.controller.postMessage({
    manifest: manifest,
    manifestUrl: manifestUrl
  });
  let link = document.getElementById("manifestLink");
  if (!link || link.href != manifestUrl) {
    if (link) link.parentElement.removeChild(link);
    link = document.createElement("link");
    link.id = "manifestLink";
    link.rel = "manifest";
    link.href = manifestUrl;
    document.head.appendChild(link);
  }
  printLn("SW updated.");
}

function controlsChanged() {
  const manifest = readControlsManifest();
  const manifestUrl = manifestUrlSelect.value;
  updateSWAndManifestLink(manifest, manifestUrl);
  updateLS(manifest, manifestUrl);
  updateDisplay(manifest, manifestUrl);
}

main();

// Utility functions

function djb2(str) {
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}

function hashStringToColor(str) {
  var hash = djb2(str);
  var r = (hash & 0xff0000) >> 16;
  var g = (hash & 0x00ff00) >> 8;
  var b = hash & 0x0000ff;
  return (
    "#" +
    ("0" + r.toString(16)).substr(-2) +
    ("0" + g.toString(16)).substr(-2) +
    ("0" + b.toString(16)).substr(-2)
  );
}
