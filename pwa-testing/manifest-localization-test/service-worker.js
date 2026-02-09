const CACHE_NAME = 'manifest-localization-test-v2';
const MANIFEST_URL = './manifest.json';

// Files to cache
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './main.js',
  './icons/icon-128.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-512.png',
  './icons/localized_icons/ar/icon-128.png',
  './icons/localized_icons/ar/icon-256.png',
  './icons/localized_icons/de/icon-128.png',
  './icons/localized_icons/de/icon-256.png'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Special handling for manifest.json
  if (url.pathname.endsWith('/manifest.json')) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Service Worker: Serving cached manifest');
            return cachedResponse;
          }
          
          // If not in cache, fetch and cache it
          return fetch(event.request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
              return response;
            });
        })
    );
    return;
  }
  
  // Default fetch strategy - cache first, falling back to network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
