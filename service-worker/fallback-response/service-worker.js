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

self.addEventListener('install', function(event) {
  // Skip the 'waiting' lifecycle phase, to go directly from 'installed' to 'activated', even if
  // there are still previous incarnations of this service worker registration active.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  // Claim any clients immediately, so that the page will be under SW control without reloading.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  var regex = /https:\/\/www.googleapis.com\/youtube\/v3\/playlistItems/;
  if (event.request.url.match(regex)) {
    // Only call event.respondWith() if this looks like a YouTube API request.
    // Because we don't call event.respondWith() for non-YouTube API requests, they will not be
    // handled by the service worker, and the default network behavior will apply.
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (!response.ok) {
          // An HTTP error response code (40x, 50x) won't cause the fetch() promise to reject.
          // We need to explicitly throw an exception to trigger the catch() clause.
          throw Error('response status ' + response.status);
        }

        // If we got back a non-error HTTP response, return it to the page.
        return response;
      }).catch(function(error) {
        console.warn('Constructing a fallback response, ' +
          'due to an error while fetching the real response:', error);

        // For demo purposes, use a pared-down, static YouTube API response as fallback.
        var fallbackResponse = {
          items: [{
            snippet: {title: 'Fallback Title 1'}
          }, {
            snippet: {title: 'Fallback Title 2'}
          }, {
            snippet: {title: 'Fallback Title 3'}
          }]
        };

        // Construct the fallback response via an in-memory variable. In a real application,
        // you might use something like `return fetch(FALLBACK_URL)` instead,
        // to retrieve the fallback response via the network.
        return new Response(JSON.stringify(fallbackResponse), {
          headers: {'Content-Type': 'application/json'}
        });
      })
    );
  }
});
