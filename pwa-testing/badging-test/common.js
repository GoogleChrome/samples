/**
 * Warn the page must be served over HTTPS
 * The `beforeinstallprompt` event won't fire if the page is served over HTTP.
 * Installability requires a service worker with a fetch event handler, and
 * if the page isn't served over HTTPS, the service worker won't load.
 */

/* Service Worker */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(() => { console.log('Service Worker Registered'); });
}

const badge =
      !!(navigator.setExperimentalAppBadge || window.ExperimentalBadge);
console.log("WTF? ", badge);
console.log("Badge: ", !!(navigator.setExperimentalAppBadge || window.ExperimentalBadge));
