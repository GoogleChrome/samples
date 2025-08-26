self.addEventListener('install', () => {
  console.log('Installed');
});

self.addEventListener('activate', () => {
  console.log('Activated');
});


self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(_ => {
    return new Response('Offline reminder.');
  }));
});

