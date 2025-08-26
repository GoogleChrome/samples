self.addEventListener('fetch', event => {
  if (event.request.url == 'https://veil-superb-gondola.glitch.me/') {
    event.respondWith(Promise.resolve(new Response('hi', {status: 200})));
    return;
  }
  event.respondWith(fetch(event.request).catch(_ => {
    return new Response('Offline gondola.');
});
});