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
  var requestUrl = new URL(event.request.url);

  // Determine whether this is a URL Shortener API request that should be mocked.
  // Matching on just the pathname gives some flexibility in case there are multiple domains that
  // might host the same RESTful API (imagine this being used to mock responses against what might be
  // a test, or QA, or production environment).
  // Also check for the existence of the 'X-Mock-Response' header.
  if (requestUrl.pathname === '/urlshortener/v1/url' &&
      event.request.headers.has('X-Mock-Response')) {
    // This matches the result format documented at
    // https://developers.google.com/url-shortener/v1/getting_started#shorten
    var responseBody = {
      kind: 'urlshortener#url',
      id: 'http://goo.gl/IKyjuU',
      longUrl: 'https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html'
    };

    var responseInit = {
      // status/statusText default to 200/OK, but we're explicitly setting them here.
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        // Purely optional, but we return a custom response header indicating that this is a
        // mock response. The controlled page could check for this header if it wanted to.
        'X-Mock-Response': 'yes'
      }
    };

    var mockResponse = new Response(JSON.stringify(responseBody), responseInit);

    console.log(' Responding with a mock response body:', responseBody);
    event.respondWith(mockResponse);
  }

  // If event.respondWith() isn't called because this wasn't a request that we want to mock,
  // then the default request/response behavior will automatically be used.
});
