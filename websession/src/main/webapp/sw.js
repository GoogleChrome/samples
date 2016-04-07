importScripts('/js/indexed-db.js');
importScripts('/js/settings.js');

dosidos.refreshSat = function(lat) {

  // To mitigate XSRF, LAT need to be sent in the HTTP header.
  var myHeaders = new Headers();
  myHeaders.set(dosidos.settings.HTTP_HEADER_LAT, lat);
  var options = {
    method: 'GET',
    headers: myHeaders,
    credentials: 'include'
  };

  var url = dosidos.settings.TOKEN_ENDPOINT_URL + '?action=REFRESH_BY_LAT';
  return fetch(url, options)
      .then(function(data) {
        return data.json();
      }).then(function(response) {
        console.log('Token response returned: '
            + response && JSON.stringify(response));
        if (!response || response['result'] == 'ERROR') {
          if (response && response['error']) {
            console.log('Error token response received: ' + response['error']);
          }
        } else if (response['result'] == 'END') {
          console.log('Token refreshing stopped.');
          return dosidos.store.clear();
        } else if (response['result'] == 'REFRESHED') {
          var satExpires = Date.now() + response['satLifetime'] * 1000 -
              dosidos.settings.TIME_BUFFER_MS;
          console.log('Next token refresh in '
              + ((satExpires - Date.now()) / 1000) + ' seconds.');
          return dosidos.store.changeSatExpires(satExpires);
        } else {
          console.log('Unknow token response type.');
        }
      });
};


/**
 * Checks if SAT is expired or not, for an authenticated web session.
 */
dosidos.check = function() {
  return dosidos.store.readSessionState().then(function (state) {
    if (state && state['enabled'] && state['satExpires'] <= Date.now()) {
      return dosidos.refreshSat(state['lat']);
    }
  });
};

/**
 * Adds listener to intercept all web requests.
 */
self.addEventListener('fetch', function(event) {
  var req = event.request;
  var doFetch = function() {
    return fetch(req);
  };
  event.respondWith(dosidos.check().then(doFetch, doFetch));
});

self.addEventListener('install', function(event) {
  // Bypass the waiting lifecycle stage,
  // just in case there's an older version of this SW registration.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  // Take control of all pages under this SW's scope immediately,
  // instead of waiting for reload/navigation.
  event.waitUntil(self.clients.claim());
});
