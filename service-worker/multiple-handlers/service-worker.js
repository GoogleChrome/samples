var helloFetchHandler = function(event) {
  console.log('Inside the /hello handler.');
  if (event.request.url.indexOf('/hello/') !== -1) {
    event.respondWith(new Response("I'm the /hello handler!"));
  }
};

var helloWorldFetchHandler = function(event) {
  console.log('Inside the /hello/world handler.');
  if (event.request.url.endsWith('/hello/world')) {
    event.respondWith(new Response("I'm the /hello/world handler!"));
  }
};

[helloWorldFetchHandler, helloFetchHandler].forEach(function(handler) {
  self.addEventListener('fetch', handler);
});
