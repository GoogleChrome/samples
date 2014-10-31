self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
    './static/pre_fetched.txt',
    './static/pre_fetched.html',
    // This is an image that will be used in pre_fetched.html
    'https://www.chromium.org/_/rsrc/1302286216006/config/customLogo.gif'
  ];

  // All of these logging statements should be visible via the "Inspect" interface
  // for the relevant SW accessed via chrome://serviceworker-internals
  console.log('Handling install event. Resources to pre-fetch:', urlsToPrefetch);

  event.waitUntil(
    caches.open('prefetch-sample').then(function(cache) {
      // This two-stage fetch() + cache.put() combo is required because Chrome doesn't
      // currently support cache.addAll(). Once support for that is added, it's preferable
      // to use that.
      // TODO: Switch code to use cache.addAll() when available.
      return Promise.all(
        urlsToPrefetch.map(function(url) {
          // It's very important to use { mode: 'no-cors' } if there is any chance that
          // the resources being fetched are served off of a server that doesn't support
          // CORS (http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
          // In this example, www.chromium.org doesn't support CORS, and the fetch()
          // would fail if the default mode of 'cors' was used for the fetch() request.
          // The drawback of hardcoding {mode: 'no-cors'} is that the response from all
          // cross-origin hosts will always be opaque
          // (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#cross-origin-resources)
          // but since this sample is focused on caching rather than modifying the responses, that is
          // not a problem.
          return fetch(url, {mode: 'no-cors'}).then(function(response) {
            console.log('Fetching of', url, 'succeeded. Response is', response);

            return response;
          });
        })
      ).then(function(responses) {
        // Cache each of the responses, using the URL of the request as the key.
        return responses.map(function(response, i) {
          return cache.put(urlsToPrefetch[i], response);
        });
      }).then(function(responses) {
        console.log('Caching of fetched responses is complete.');

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
      // TODO: Switch from catch()ing to checking if response is undefined once http://crbug.com/428486 is resolved.
      return cache.match(event.request).then(function(response) {
        console.log('Found response in cache:', response);

        return response;
      }).catch(function() {
        console.log('No response found in cache. About to fetch from network...');

        // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
        // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
        return fetch(event.request).then(function(response) {
          console.log('Response from network is:', response);

          return response;
        }).catch(function(error) {
          // This catch() will handle exceptions thrown from the fetch() operation.
          // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
          // It will return a normal response object that has the appropriate error code set.
          console.error('Fetching failed:', error);

          throw error;
        });
      });
    })
  );
});
