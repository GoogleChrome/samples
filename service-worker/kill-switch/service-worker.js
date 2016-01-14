'use strict';

// fetch event handlers are run sequentially, in the order that addEventListener('fetch', fn)
// is executed, until one of them calls event.respondWith() and returns a response to the page.
// For the kill switch to be effective, we need the addEventListener('fetch', fn) that
// registers the switch to execute first, before any other fetch event handlers are registered.
// Putting the importScripts() at the top of this file accomplishes that.
importScripts('sw-kill-switch.js');

let HTML_RESPONSE = `<html>
  <head>
    <title>Oops!</title>
  </head>
  <body>
    <h1>Ooops!</h1>
    <p>This response is returned for <em>every</em> request in the service worker's scope.</p>
    <p>
      You should visit <a href="${self.KILL_SWITCH_URL_FRAGMENT}">the kill switch page</a>
      (any URL containing <code>${self.KILL_SWITCH_URL_FRAGMENT}</code>) to unregister
      the service worker and get back to normal!
    </p>
  </body>
</html>`;

// This is a deliberately dangerous fetch handler, used as an example of how a developer might
// accidentally register a service worker that has unintended consequences.
self.addEventListener('fetch', event => {
  event.respondWith(new Response(HTML_RESPONSE, {headers: {'Content-Type': 'text/html'}}));
});
