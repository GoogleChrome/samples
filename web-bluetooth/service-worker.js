function addToCache(request, networkResponse) {
  return caches.open('web-bluetooth')
    .then(cache => cache.put(request, networkResponse.clone()));
}

function getCacheResponse(request) {
  return caches.open('web-bluetooth').then(cache => {
    return cache.match(request);
  });
}

function getNetworkOrCacheResponse(request) {
  return fetch(request).then(networkResponse => {
    addToCache(request, networkResponse);
    return networkResponse;
  }).catch(_ => {
    return getCacheResponse(request)
      .then(cacheResponse => cacheResponse || Response.error());
  });
}

self.addEventListener('fetch', event => {
  event.respondWith(getNetworkOrCacheResponse(event.request));
});
