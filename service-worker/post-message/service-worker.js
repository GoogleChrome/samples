/*
 Copyright 2014 Google Inc. All Rights Reserved.
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

// This polyfill provides Cache.add(), Cache.addAll(), and CacheStorage.match(),
// which are not implemented in Chrome 40.
importScripts('../serviceworker-cache-polyfill.js');

// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// all multiple caches used by a given service worker, and keep them all versioned.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.
var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  'some-cache': 'some-cache-v' + CACHE_VERSION
};

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) == -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('message', function(event) {
  console.log('Handling message event:', event);

  caches.open(CURRENT_CACHES['some-cache']).then(function(cache) {
    switch (event.data.command) {
      case 'keys':
        cache.keys().then(function(requests) {
          var urls = requests.map(function(request) {
            return request.url;
          });

          event.ports[0].postMessage({
            error: null,
            urls: urls
          });
        }).catch(function(error) {
          event.ports[0].postMessage({
            error: error.toString()
          });
        });
      break;

      case 'add':
        cache.add(new Request(event.data.url, {mode: 'no-cors'})).then(function(response) {
          event.ports[0].postMessage({
            error: null
          });
        }).catch(function(error) {
          console.error('vvvvv');
          event.ports[0].postMessage({
            error: error.toString()
          });
        });
      break;

      case 'delete':
        cache.delete(event.data.url).then(function() {
          event.ports[0].postMessage({
            error: null
          });
        }).catch(function(error) {
          event.ports[0].postMessage({
            error: error.toString()
          });
        });
      break;

      default:
        event.ports[0].postMessage({
          error: 'Unknown command: ' + event.data.command
        });
    }
  });
});
