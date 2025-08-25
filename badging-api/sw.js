let requestCounter = 0;

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(++requestCounter);
  }
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(fetch(e.request));
});
