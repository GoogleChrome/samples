const express = require("express");
const wbn = require('wbn');
const app = express();

const origin = 'https://us-central1-web-devrel-apps.cloudfunctions.net/webappbundle/';

const SW_SCRIPT = `
const CACHE_NAME = 'my-cache';
const URLS_TO_CACHE = [
  '/webappbundle/index.html',
  '/webappbundle/style.css',
  '/webappbundle/app.js'
];

self.addEventListener('install', (event) => {
  const installPromise = new Promise(async (resolve) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(URLS_TO_CACHE);
    resolve();
  });
  event.waitUntil(installPromise);
});
self.addEventListener('fetch', function(event) {
  console.log('fetch: ' + event.request.url);
  if (event.request.url.indexOf('sw_generated') != -1) {
    event.respondWith(new Response(
        "<h1>hello from service worker!</h1>",
        {headers: { 'Content-Type': 'text/html' }}));
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
`;

const TOP_HTML = `
<body><h1>Page in wbn</h1>
<div><a href="index.html">index.html</a></div>
<div><a href="sw_generated">sw_generated</a></div>
<script src="/webappbundle/script.js"></script></body>
`;

const SCRIPT_JS = `
(()=>{
  function log(txt) {
    console.log(txt);
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(txt));
    document.body.appendChild(div);
    console.log(txt);
  }
  const button = document.createElement('button');
  button.appendChild(document.createTextNode('register SW'));
  button.addEventListener('click', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/webappbundle/sw.js');
      log('success');
    } catch (e) {
      log('fail');
      console.log(e);
    }

  });
  document.body.appendChild(button);

})();
`;

const INDEX_HTML = `
<head>
<link rel="stylesheet" href="/webappbundle/style.css" type="text/css" />
</head>
<h1>index.html</h1><script src="/webappbundle/app.js"></script>
`;

const APP_JS = `
console.log("hello");
`;

const STYLE_CSS = `
h1 {color: red}
`;



app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.get("/test.wbn", (request, response) => {
  const primary_url = origin;

  const iframe_url = origin + 'iframe.html';
  const script_url = origin + 'script.js';

  const sw_url = origin + 'sw.js';
  const index_url = origin + 'index.html';
  const style_url = origin + 'style.css';
  const appjs_url = origin + 'app.js';

  const builder = (new wbn.BundleBuilder(primary_url))
    .setManifestURL(primary_url)
    .addExchange(
      sw_url,
      200,
      {'Content-Type': 'application/javascript'},
      SW_SCRIPT)
    .addExchange(
      index_url,
      200,
      {'Content-Type': 'text/html'},
      INDEX_HTML)
    .addExchange(
      style_url,
      200,
      {'Content-Type': 'text/css'},
      STYLE_CSS)
    .addExchange(
      appjs_url,
      200,
      {'Content-Type': 'application/javascript'},
      APP_JS)
    .addExchange(
      primary_url,
      200,
      {'Content-Type': 'text/html'},
      TOP_HTML)
    .addExchange(
      script_url,
      200,
      {'Content-Type': 'application/javascript'},
      SCRIPT_JS);

  response.set('content-type', 'application/webbundle');
  response.set('X-Content-Type-Options', 'nosniff');
  response.send(builder.createBundle());
});

exports.webappbundle = app;
