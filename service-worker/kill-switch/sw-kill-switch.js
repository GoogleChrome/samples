(global => {
  // Explicitly set this value on the ServiceWorkerGlobalScope so that we can use it as
  // self.KILL_SWITCH_URL_FRAGMENT within the main service-worker.js file.
  global.KILL_SWITCH_URL_FRAGMENT = 'unregister-service-worker';

  const HTML_RESPONSE = `<html>
  <head>
    <title>Service Worker Unregistered</title>
  </head>
  <body>
    <h1>Service Worker Unregistered</h1>
    <p>
      The offending service worker has been unregistered,
      and you can return to <a href="index.html">the main page</a>.
    </p>
  </body>
</html>`;

  // This fetch event listener should be added as early as possible, so that it gets
  // "first crack" at handling the event.
  global.addEventListener('fetch', event => {
    if (event.request.url.includes(global.KILL_SWITCH_URL_FRAGMENT)) {
      // Call event.respondWith() conditionally, based on the request URL.
      // The first fetch event handler that calls event.respondWith() "wins", and returns the
      // response to the controlled page. No other fetch event handlers will run.
      event.respondWith(
        // registration.unregister() will unregister the current service worker.
        global.registration.unregister().then(
          // After the service worker unregisters, return an HTML response.
          () => new Response(HTML_RESPONSE, {headers: {'Content-Type': 'text/html'}}))
      );
    }
  });
})(self);
