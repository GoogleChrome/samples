self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    (async () => {
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        const response = await event.preloadResponse;
        if (response) {
          return response;
        }
        return fetch(event.request);
      } catch {
        return new Response('Offline');
      }
    })()
  );
});
