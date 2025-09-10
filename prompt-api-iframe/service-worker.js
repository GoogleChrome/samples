self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // Claim all clients
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin === 'https://prompt-api-iframe.glitch.me') {
    event.respondWith(
      (async () => {
        const response = await fetch(event.request);
        const cloned = response.clone();
        const body = await cloned.text();

        console.log('[Service Worker] Response body from prompt-api-iframe:', body);

        return response;
      })()
    );
  }
});