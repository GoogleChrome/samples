/*
 Copyright 2015 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

'use strict';

const OFFLINE_CACHE = 'offline';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', function(event) {
  const offlineRequest = new Request(OFFLINE_URL);
  event.waitUntil(
    fetch(offlineRequest).then(function(response) {
      return caches.open(OFFLINE_CACHE).then(function(cache) {
        return cache.put(offlineRequest, response);
      });
    })
  );
});

self.addEventListener('fetch', function(event) {
  // We only want to call event.respondWith() if this is a GET request for an HTML document.
  if (event.request.method === 'GET' &&
      event.request.headers.get('accept').includes('text/html')) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).catch(function(e) {
        // The catch is only triggered if fetch() throws an exception, which will most likely
        // happen due to the server being unreachable.
        // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx range,
        // the catch() will NOT be called. If you need custom handling for 4xx or 5xx errors, see
        // https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response

        // Normally, fetch() will consult the browser's HTTP caches before attempting a
        // network request, so in order to trigger offline failure for this sample, we had to
        // use a cache-busting URL parameter to avoid the cache.
        console.error('Fetch failed; returning offline page instead.', e);
        return caches.open(OFFLINE_CACHE).then(function(cache) {
          return cache.match(OFFLINE_URL);
        });
      })
    );
  }

  // If our if() condition is false, then this fetch handler won't intercept the request. If there
  // are any other fetch handlers registered, they will get a chance to call event.respondWith().
  // If no fetch handlers call event.respondWith(), the request will be handled by the browser
  // as if there were no service worker involvement.
});
