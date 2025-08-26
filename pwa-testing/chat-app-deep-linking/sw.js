self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
    })(),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      (async () => {
        try {
          const response = await event.preloadResponse;
          if (response) return response;
          return fetch(event.request);
        } catch {
          return new Response(
              'Offline. Note - this page should have a launchParams consumer ' +
              'if your client mode is "focus-existing", as otherwise users ' +
              'will get stuck here!');
        }
      })(),
  );
});
