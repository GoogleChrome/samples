function handleInstall(e) {
  console.log('oninstall', e);
}

function handleActivate(e) {
  console.log('onactivate', e);
}

function handleFetch(e) {
  console.log('onfetch', e);
}

function handleBeforeEvicted(e) {
  console.log('onbeforeevicted', e);
}

function handleEvicted(e) {
  console.log('onevicted', e);
}

function handleMessage(e) {
  console.log('onmessage', e);

  switch (e.data) {
    case 'update':
      // Not yet implemented in Chrome Canary.
      // self.update();
      e.ports[0].postMessage('self.update() would have been called on the Service Worker (not currently implemented).');
    break;

    case 'getAll':
      self.clients.getAll().then(function(serviceWorkerClients) {
        var clientUrls = serviceWorkerClients.map(function(serviceWorkerClient) {
          return serviceWorkerClient.url;
        }).join(', ');

        e.ports[0].postMessage('Client URLs: ' + clientUrls);
      });
    break;

    default:
      e.ports[0].postMessage('Echo from Service Worker: ' + e.data);
  }
}

function addEventListeners() {
  self.addEventListener('install', handleInstall);
  self.addEventListener('activate', handleActivate);
  self.addEventListener('fetch', handleFetch);
  self.addEventListener('beforeevicted', handleBeforeEvicted);
  self.addEventListener('evicted', handleEvicted);
  self.addEventListener('message', handleMessage);
}

addEventListeners();
