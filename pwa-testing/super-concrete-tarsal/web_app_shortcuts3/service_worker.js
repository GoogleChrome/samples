self.addEventListener('fetch', e => {
  e.respondWith((async () => {
    try {
      return await fetch(e.request);
    } catch (error) {
      return new Response('Offline');
    }
  })());
});
