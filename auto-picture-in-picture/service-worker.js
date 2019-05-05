self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  if (!navigator.onLine) {
    event.respondWith(new Response('offline ;('));
  }
});
