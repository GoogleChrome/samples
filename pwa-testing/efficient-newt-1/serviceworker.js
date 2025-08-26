const origin = self.registration.scope;

let resolveManifest = null;
let manifest = null;
let manifestPromise = new Promise(resolve => resolveManifest = resolve);

self.addEventListener('message', event => {
  manifest = event.data;
  if (resolveManifest) {
    resolveManifest(manifest);
    resolveManifest = null;
  } else {
    manifestPromise = Promise.resolve(manifest);
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method == 'GET' && event.request.url.endsWith('/manifest.webmanifest')) {
    event.respondWith(
      manifestPromise.then(
        manifest => new Response(JSON.stringify(manifest), {status: 200})
      )
    );
  } else {
    event.respondWith(fetch(event.request).catch(_ => {
      return new Response('Offline newt.');
    }));
  }
});