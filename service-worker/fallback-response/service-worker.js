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

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    fetch(event.request).then(function(response) {
      // At this point, we have some sort of response, but it might be an error response.
      // Since the YouTube API calls we're making support CORS, the corresponding response will not be opaque, and
      // response.status will contain a real value.
      if (response.status >= 400) {
        // Any 4xx or 5xx HTTP status code indicates an error, so this potentially is a situation
        // in which we'd want to return a fallback response.

        if (event.request.url.match(/https:\/\/www.googleapis.com\/youtube\/v3\/playlistItems/)) {
          // We only want to return our fallback response if this is a specific type of API request.
          // In a real application, you might have logic that returned different responses for different types of
          // requests, using the request URL or the request headers (like Accept:) to determine if/how to fallback.
          console.info('Returning fallback response to page...');
          return fallbackResponse();
        } else {
          // If this is an error response not associated with the specific type API request we have a fallback for,
          // then just return it to the browser and it will be treated like any other failed HTTP request.
          console.error('Returning error response directly to page:', response);
          return response;
        }
      } else {
        // If the HTTP response code is less than 400, then it's either
        //   a) a successful response (e.g. HTTP 20x)
        //   b) an opaque filtered response (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque) which
        //      has a .status of 0. Since we can't detect whether it's an error or not, just return it directly to
        //      the page.
        console.log('Returning response directly to page:', response);
        return response;
      }
    }).catch(function(error) {
      // This catch() will handle exceptions that arise from the fetch() operation.
      // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
      console.error('fetch() failed:', error);

      throw error;
    })
  );
});

function fallbackResponse() {
  // This particular implementation relies on fetch()ing a hardcoded response (that should hopefully not return
  // an error) as a fallback. As an alternative, you can construct and return your own Response object using a
  // Blob as the response body and with whatever headers and response status you'd like.
  // See https://fetch.spec.whatwg.org/#response-class
  return fetch('static/youtube_api_fallback.json');
}
