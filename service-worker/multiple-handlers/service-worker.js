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

// Within each fetch handler, make sure that the logic which determines whether or not to call
// event.respondWith() is executed synchronously! Simple if() statements that check
// event.request.url are fine. Anything asynchronous, like performing a caches.match() and then
// deciding whether or not to call event.respondWith() based on the response, will trigger a
// race condition, and you're likely to see an "event already responded to" error in the console.
var helloFetchHandler = function(event) {
  console.log('Inside the /hello handler.');
  if (event.request.url.indexOf('/hello/') !== -1) {
    event.respondWith(new Response('I\'m the /hello handler!'));
  }
};

var helloWorldFetchHandler = function(event) {
  console.log('Inside the /hello/world handler.');
  if (event.request.url.endsWith('/hello/world')) {
    event.respondWith(new Response('I\'m the /hello/world handler!'));
  }
};

// Register the helloWorldFetchHandler first, then the helloFetchHandler.
// When a fetch event occurs, they're invoked one at a time, in the order that they're registered.
// As soon as one handler calls event.respondWith(), none of the other registered handlers will be run.
[helloWorldFetchHandler, helloFetchHandler].forEach(function(handler) {
  self.addEventListener('fetch', handler);
});
