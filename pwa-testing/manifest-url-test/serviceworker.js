const origin = self.registration.scope;

let resolveManifest = null;
let manifest = null;
let manifestPromise = new Promise(resolve => resolveManifest = resolve);

// Cache manifest to be used later.
self.addEventListener('message', event => {
  console.log('*** Service Worker *** message: ' + event);
  manifest = event.data;
  if (resolveManifest) {
    resolveManifest(manifest);
    resolveManifest = null;
  } else {
    manifestPromise = Promise.resolve(manifest);
  }
});

// Dynamically serve the manifest that will be used for installation.
self.addEventListener('fetch', event => {
  console.log('*** Service Worker *** fetch: ' + event.request.url);
  if (event.request.method == 'GET' && event.request.url.endsWith('/manifest.webmanifest')) {
    console.log('*** Service Worker *** Detected manifest: ', manifest);
    event.respondWith(
      manifestPromise.then(
        manifest => new Response(JSON.stringify(manifest, null, 2), {status: 200})
      )
    );
  }
});