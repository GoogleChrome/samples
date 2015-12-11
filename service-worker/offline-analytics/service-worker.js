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

// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.
var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  'offline-analytics': 'offline-analytics-v' + CACHE_VERSION
};

var idbDatabase;
var IDB_VERSION = 1;
var STOP_RETRYING_AFTER = 86400000; // One day, in milliseconds.
var STORE_NAME = 'urls';

// This is basic boilerplate for interacting with IndexedDB. Adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
function openDatabaseAndReplayRequests() {
  var indexedDBOpenRequest = indexedDB.open('offline-analytics', IDB_VERSION);

  // This top-level error handler will be invoked any time there's an IndexedDB-related error.
  indexedDBOpenRequest.onerror = function(error) {
    console.error('IndexedDB error:', error);
  };

  // This should only execute if there's a need to create a new database for the given IDB_VERSION.
  indexedDBOpenRequest.onupgradeneeded = function() {
    this.result.createObjectStore(STORE_NAME, {keyPath: 'url'});
  };

  // This will execute each time the database is opened.
  indexedDBOpenRequest.onsuccess = function() {
    idbDatabase = this.result;
    replayAnalyticsRequests();
  };
}

// Helper method to get the object store that we care about.
function getObjectStore(storeName, mode) {
  return idbDatabase.transaction(storeName, mode).objectStore(storeName);
}

function replayAnalyticsRequests() {
  var savedRequests = [];

  getObjectStore(STORE_NAME).openCursor().onsuccess = function(event) {
    // See https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Using_a_cursor
    var cursor = event.target.result;

    if (cursor) {
      // Keep moving the cursor forward and collecting saved requests.
      savedRequests.push(cursor.value);
      cursor.continue();
    } else {
      // At this point, we have all the saved requests.
      console.log('About to replay %d saved Google Analytics requests...',
        savedRequests.length);

      savedRequests.forEach(function(savedRequest) {
        var queueTime = Date.now() - savedRequest.timestamp;
        if (queueTime > STOP_RETRYING_AFTER) {
          getObjectStore(STORE_NAME, 'readwrite').delete(savedRequest.url);
          console.log(' Request has been queued for %d milliseconds. ' +
            'No longer attempting to replay.', queueTime);
        } else {
          // The qt= URL parameter specifies the time delta in between right now, and when the
          // /collect request was initially intended to be sent. See
          // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt
          var requestUrl = savedRequest.url + '&qt=' + queueTime;

          console.log(' Replaying', requestUrl);

          fetch(requestUrl).then(function(response) {
            if (response.status < 400) {
              // If sending the /collect request was successful, then remove it from the IndexedDB.
              getObjectStore(STORE_NAME, 'readwrite').delete(savedRequest.url);
              console.log(' Replaying succeeded.');
            } else {
              // This will be triggered if, e.g., Google Analytics returns a HTTP 50x response.
              // The request will be replayed the next time the service worker starts up.
              console.error(' Replaying failed:', response);
            }
          }).catch(function(error) {
            // This will be triggered if the network is still down. The request will be replayed again
            // the next time the service worker starts up.
            console.error(' Replaying failed:', error);
          });
        }
      });
    }
  };
}

// Open the IndexedDB and check for requests to replay each time the service worker starts up.
// Since the service worker is terminated fairly frequently, it should start up again for most
// page navigations. It also might start up if it's used in a background sync or a push
// notification context.
openDatabaseAndReplayRequests();

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    // `caches` refers to the global CacheStorage object, and is defined at
    // http://slightlyoff.github.io/ServiceWorker/spec/service_worker/#self-caches
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// This sample illustrates an aggressive approach to caching, in which every valid response is
// cached and every request is first checked against the cache.
// This may not be an appropriate approach if your web application makes requests for
// arbitrary URLs as part of its normal operation (e.g. a RSS client or a news aggregator),
// as the cache could end up containing large responses that might not end up ever being accessed.
// Other approaches, like selectively caching based on response headers or only caching
// responses served from a specific domain, might be more appropriate for those use cases.
self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.open(CURRENT_CACHES['offline-analytics']).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        if (response) {
          // If there is an entry in the cache for event.request, then response will be defined
          // and we can just return it.
          console.log(' Found response in cache:', response);

          return response;
        }

        // Otherwise, if there is no entry in the cache for event.request, response will be
        // undefined, and we need to fetch() the resource.
        console.log(' No response for %s found in cache. ' +
          'About to fetch from network...', event.request.url);

        // We call .clone() on the request since we might use it in the call to cache.put() later on.
        // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
        // (see https://fetch.spec.whatwg.org/#dom-request-clone)
        return fetch(event.request.clone()).then(function(response) {
          console.log('  Response for %s from network is: %O',
            event.request.url, response);

          // Optional: add in extra conditions here, e.g. response.type == 'basic' to only cache
          // responses from the same domain. See https://fetch.spec.whatwg.org/#concept-response-type
          if (response.status < 400) {
            // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
            // One limitation is that, for non-CORS requests, we get back a filtered opaque response
            // (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque) which will always have a
            // .status of 0, regardless of whether the underlying HTTP call was successful. Since we're
            // blindly caching those opaque responses, we run the risk of caching a transient error response.
            //
            // We need to call .clone() on the response object to save a copy of it to the cache.
            // (https://fetch.spec.whatwg.org/#dom-request-clone)
            cache.put(event.request, response.clone());
          } else if (response.status >= 500) {
            // If this is a Google Analytics ping then we want to retry it if a HTTP 5xx response
            // was returned, just like we'd retry it if the network was down.
            checkForAnalyticsRequest(event.request.url);
          }

          // Return the original response object, which will be used to fulfill the resource request.
          return response;
        }).catch(function(error) {
          // The catch() will be triggered for network failures. Let's see if it was a request for
          // a Google Analytics ping, and save it to be retried if it was.
          checkForAnalyticsRequest(event.request.url);

          throw error;
        });
      }).catch(function(error) {
        // This catch() will handle exceptions that arise from the match() or fetch() operations.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        throw error;
      });
    })
  );
});

function checkForAnalyticsRequest(requestUrl) {
  // Construct a URL object (https://developer.mozilla.org/en-US/docs/Web/API/URL.URL)
  // to make it easier to check the various components without dealing with string parsing.
  var url = new URL(requestUrl);

  if ((url.hostname === 'www.google-analytics.com' ||
       url.hostname === 'ssl.google-analytics.com') &&
       url.pathname === '/collect') {
    console.log('  Storing Google Analytics request in IndexedDB ' +
      'to be replayed later.');
    saveAnalyticsRequest(requestUrl);
  }
}

function saveAnalyticsRequest(requestUrl) {
  getObjectStore(STORE_NAME, 'readwrite').add({
    url: requestUrl,
    timestamp: Date.now()
  });
}
