self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.open('pass-through-caching-sample').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        if (response) {
          // If there is an entry in the cache for event.request, then response will be defined
          // and we can just return it.
          console.log(' Found response in cache:', response);

          return response;
        } else {
          // Otherwise, if there is no entry in the cache for event.request, response will be
          // undefined, and we need to fetch() the resource.
          console.log(' No response for %s found in cache. About to fetch from network...', event.request.url);

          return fetch(event.request).then(function(response) {
            console.log('  Response for %s from network is: %O', event.request.url, response);

            if (response && response.status < 400) {
              // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
              // One limitation is that, for non-CORS requests, we get back a filtered opaque response
              // (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque) which will always have a
              // .status of 0, regardless of whether the underlying HTTP call was successful. Since we're
              // blindly caching those opaque responses, we run the risk of caching a transient error response.
              //
              // We need to call .clone() on the response object to save a copy of it to the cache.
              // (https://fetch.spec.whatwg.org/#dom-request-clone)
              cache.put(event.request, response.clone());
            }

            // Return the original response object, which will be used to fulfill the resource request.
            return response;
          });
        }
      }).catch(function(error) {
        // This catch() will handle exceptions that arise from the match() or fetch() operations.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('  Pass-through caching failed:', error);

        throw error;
      });
    })
  );
});
