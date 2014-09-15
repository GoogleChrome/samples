// In Chrome, you can view these log messages and many more useful pieces of
// debugging info at chrome://serviceworker-internals

self.addEventListener('install', function(e) {
  // This event will be fired once when this version of the script is first registered for
  // a given URL scope.
  // It's an opportunity to initialize caches and prefetch data, if desired.
  console.log('Install event:', e);
});

self.addEventListener('activate', function(e) {
  // This event will be fired once when this version of the script is first registered for
  // a given URL scope.
  // It's an opportunity to clean up any stale data that might be left behind in self.caches
  // by an older version of this script.
  // It will NOT be fired each time the Service Worker is revived after being terminated.
  // To perform an action when the Service Worker is revived, include that logic in the
  // `onfetch` or `onmessage` event listeners.
  console.log('Activate event:', e);
});
