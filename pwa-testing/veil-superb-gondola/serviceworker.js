self.addEventListener('fetch', event => {
  if (event.request.url == 'https://googlechrome.github.io/samples/pwa-testing/veil-superb-gondola/') {
    event.respondWith(Promise.resolve(new Response('hi', {status: 200})));
    return;
  }
  event.respondWith(fetch(event.request).catch(_ => {
    return new Response('Offline gondola.');
  }))
});
