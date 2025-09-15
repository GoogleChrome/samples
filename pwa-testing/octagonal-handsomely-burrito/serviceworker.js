self.addEventListener('fetch', event => {
  if (event.request.mode == "navigate" && new URL(event.request.url).pathname == "/burrito") {
    event.respondWith(Response.redirect("https://googlechrome.github.io/samples/pwa-testing/octagonal-handsomely-burrito//"));
    return;
  }
  if (event.request.mode == "navigate" && new URL(event.request.url).pathname == "/butternut") {
    event.respondWith(Response.redirect("https://googlechrome.github.io/samples/pwa-testing/intriguing-veiled-butternut/"));
    return;
  }
  event.respondWith(fetch(event.request).catch(_ => {
    return new Response('Offline Handsome Burrito.');
  }));
});
