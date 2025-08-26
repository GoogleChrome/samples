'use strict';

/*

var cacheName= 'prefetch-cache-1';
var prefetchedURLs = [
    'index.html',
    'fast.html',
    'medium.html',
    'slow.html',
    'manifest.json',
    'blue-192.png'
];


self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return Promise.all(prefetchedURLs.map((url) => {
                return fetch(url).then(res => {
                    if(res.status >= 400) throw Error('request failed')
                    console.log('Cached ' + url);
                    return cache.put(url,res)
                })
            }))
        })
    )
});


function delay(t, v) {
   return new Promise(function(resolve) {
       setTimeout(resolve.bind(null, v), t)
   });
}

function interval(url) {
  if (url.endsWith('slow.html'))
    return 3000;
  if (url.endsWith('medium.html'))
    return 1000;
  return 0;
}



self.addEventListener('fetch', function(event) {
  event.respondWith(
    delay(interval(event.request.url)).then(function() {

            return caches.match(event.request).then(function(res) {
            if (res) {
                return res;
            }


            return fetch(event.request);
            });
    }));
});


*/
