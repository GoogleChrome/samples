const CACHE_NAME = "wikimedia-cache";

const ASSETS = [
  "./",
  "./index.html",
  "./script.js",
  "./style.css",
  "./manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ASSETS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      Promise.all(
        keys.map(async key => {
          if (key !== CACHE_NAME) {
            await caches.delete(key);
          }
        })
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    (async () => {
      return fetch(e.request).catch(() => caches.match(e.request));
    })()
  );
});
