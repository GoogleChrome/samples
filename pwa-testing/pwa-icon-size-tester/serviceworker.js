const origin = self.registration.scope;

let resolveManifest = null;
let manifest = null;
let manifestPromise = new Promise(resolve => resolveManifest = resolve);

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

self.addEventListener('fetch', event => {
  console.log('*** Service Worker *** fetch: ' + event.request.url);
  if (event.request.method == 'GET' && event.request.url.endsWith('/manifest.webmanifest')) {
    console.log('*** Service Worker *** Detected manifest: ', manifest);
    if (manifest == null) {
      manifest = {
        name: "App Foo",
        description: "A PWA to test icon sizes",
        background_color: "green",
        theme_color: "blue",
        display: "minimal-ui",
        scope: "/",
        start_url: "/",
        icons: []
      };
      console.log('*** Service Worker *** Using manifest: ', manifest);
    }
    event.respondWith(
      manifestPromise.then(
        manifest => new Response(JSON.stringify(manifest, null, 2), {status: 200})
      )
    );
  } /*else {
    event.respondWith(fetch(event.request).catch(_ => {
      return new Response('Offline newt.');
    }));
  }*/
});