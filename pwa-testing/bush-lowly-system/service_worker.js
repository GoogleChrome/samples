'use strict';

function serveRectangle(event) {
  let color = '#' + Math.floor((Math.random() * 800) + 100);
  let body = '<style>* { background-color: ' + color + '; }</style>';
  const init = {
    status: 200,
    statusText: 'OK',
    headers: {'Content-Type': 'text/html', 'Refresh': '3'}
  };

  event.respondWith(new Response(body, init));
}

self.addEventListener('fetch', (event) => {
  const pathname = (new URL(event.request.url)).pathname;
  if (pathname.endsWith('/rectangle.html')) {
    serveRectangle(event);
    return;
  }

  event.respondWith(
    caches.open('treasure').then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
