self.addEventListener('fetch', event => {
  if (event.request.mode == "navigate" && new URL(event.request.url).pathname == "/burrito") {
    event.respondWith(Response.redirect("https://octagonal-handsomely-burrito.glitch.me/"));
    return;
  }
  if (event.request.mode == "navigate" && new URL(event.request.url).pathname == "/butternut") {
    event.respondWith(Response.redirect("https://intriguing-veiled-butternut.glitch.me/"));
    return;
  }
  event.respondWith(fetch(event.request).catch(_ => {
    return new Response('Offline butternut tree.');
  }));
});
