self.addEventListener('install', () => {
  console.log('Installed');
});

self.addEventListener('activate', () => {
  console.log('Activated');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
