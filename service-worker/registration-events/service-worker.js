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

// In Chrome, you can view these log messages and many more useful pieces of
// debugging info at chrome://inspect/#service-workers

self.addEventListener('install', function(e) {
  // This event will be fired once when this version of the script is first registered for
  // a given URL scope.
  // It's an opportunity to initialize caches and prefetch data, if desired. This sort of
  // work should be wrapped in a Promise, and e.waitUntil(promise) can be used to ensure that
  // this installation does not complete until the Promise is settled.
  // Also, be aware that there may already be an existing service worker controlling the page
  // (either an earlier version of this script or a completely different script.)
  console.log('Install event:', e);
});

self.addEventListener('activate', function(e) {
  // This event will be fired once when this version of the script is first registered for
  // a given URL scope.
  // It's an opportunity to clean up any stale data that might be left behind in self.caches
  // by an older version of this script.
  // e.waitUntil(promise) is also available here to delay activation until work has been performed,
  // but note that waiting within the activate event will delay handling of any
  // fetch or message events that are fired in the interim. When possible, do work during the install phase.
  // It will NOT be fired each time the service worker is revived after being terminated.
  // To perform an action when the service worker is revived, include that logic in the
  // `onfetch` or `onmessage` event listeners.
  console.log('Activate event:', e);
});
