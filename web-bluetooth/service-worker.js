self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(event.request.url);

  // Don't cache anything that is not on this origin.
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(caches.open('web-bluetooth').then(cache => {
    return cache.match(request).then(response => {
      var fetchPromise = fetch(request).then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
      // Return the response from cache or wait for network.
      return response || fetchPromise;
    });
  }));
});
