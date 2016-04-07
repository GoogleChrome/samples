
/**
 * Installs/Reinstalls the service worker.
 * @param swUrl The URL of the service worker.
 * @param swScope The Scope of the service worker.
 * @param lat The long live auth token.
 * @param satLifetime The life time of the short lived token.
 */
dosidos.installServiceWorker = function(swUrl, swScope, lat, satLifetime) {
  if (!('serviceWorker' in navigator)) {
    console.log('Browser doesn\'t support service worker');
    return;
  }

  navigator.serviceWorker.register(swUrl, {scope: swScope})
      .then(function(registration) {
        console.log('Service Worker is successfully registrated.');
        var satExpires = Date.now() + satLifetime * 1000 -
            dosidos.settings.TIME_BUFFER_MS;
        var sessionState = {
          'lat': lat,
          'satExpires': satExpires
        };
        dosidos.store.restart(sessionState).then(function() {
          console.log('Service Worker is restarted.');
        });
      }).catch(function(err) {
        console.log('ServiceWorker registration failed: ' + err);
      });
};
