self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
    './static/file1.txt',
    './static/file2.txt'
  ];

  // All of these logging statements should be visible via the "Inspect" interface
  // for the relevant SW accessed via chrome://serviceworker-internals
  console.log('Handling install event. Resources to pre-fetch:', urlsToPrefetch);

  event.waitUntil(
    caches.open('prefetch-sample').then(function(cache) {
      console.log('Successfully opened the cache. About to pre-fetch...');

      // This two-stage fetch() + cache.put() combo is required because Chrome doesn't
      // currently support cache.addAll(). Once support for that is added, it's preferable
      // to use that.
      return Promise.all(
        urlsToPrefetch.map(function(url) {
          return fetch(url);
        })
      ).then(function(responses) {
        return responses.map(function(response, i) {
          return cache.put(urlsToPrefetch[i], response);
        });
      }).then(function(responses) {
        console.log('Pre-fetching is complete.');

        return responses;
      });
    }).catch(function(error) {
      // This catch() will handle any exceptions from the fetch()/cache.put() steps.
      console.error('Pre-fetching failed:', error);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.open('prefetch-sample').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        console.log('Found response in cache:', response);

        return response;
      }).catch(function() {
        // This catch() will handle exceptions due to missing cache entries.
        // Don't panic! That just means we need to fetch the resource from the network.
        console.log('No response found in cache. About to fetch from network...');

        return fetch(event.request).then(function(response) {
          console.log('Response from network is:', response);

          return response;
        }).catch(function(error) {
          // This catch() will handle exceptions thrown from the fetch() operation.
          // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
          console.error('Fetching failed:', error);

          throw error;
        });
      });
    })
  );
});
