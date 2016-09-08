var CACHE_NAME = 'window-cache-v1';
var cacheEntriesUl = document.querySelector('#cache-entries');

function initializeUI() {
  document.querySelector('#files').style.display = 'block';

  document.querySelector('#add').addEventListener('click', function() {
    var url = document.querySelector('#url').value;
    if (url) {
      addUrlToCache(url);
    }
  });

  showList();
}

function showList() {
  // Clear out any previous entries, in case this is being called after adding a
  // new entry to the cache.
  while (cacheEntriesUl.firstChild) {
    cacheEntriesUl.removeChild(cacheEntriesUl.firstChild);
  }

  // All the Cache Storage API methods return Promises. If you're not familiar
  // with them, see http://www.html5rocks.com/en/tutorials/es6/promises/
  // Here, we're iterating over all the available caches, and for each cache,
  // iterating over all the entries, adding each to the list.
  window.caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      window.caches.open(cacheName).then(function(cache) {
        return cache.keys();
      }).then(function(requests) {
        requests.forEach(function(request) {
          addRequestToList(cacheName, request);
        });
      });
    });
  });
}

// This uses window.fetch() (https://developers.google.com/web/updates/2015/03/introduction-to-fetch)
// to retrieve a Response from the network, and store it in the named cache.
// In some cases, cache.add() can be used instead of the fetch()/cache.put(),
// but only if we know that the resource we're fetching supports CORS.
// cache.add() will fail when the response status isn't 200, and when CORS isn't
// supported, the response status is always 0.
// (See https://github.com/w3c/ServiceWorker/issues/823).
function addUrlToCache(url) {
  window.fetch(url, {mode: 'no-cors'}).then(function(response) {
    caches.open(CACHE_NAME).then(function(cache) {
      cache.put(url, response).then(showList);
    });
  }).catch(function(error) {
    ChromeSamples.setStatus(error);
  });
}

// Helper method to add a cached Request to the list of the cache contents.
function addRequestToList(cacheName, request) {
  var url = request.url;

  var spanElement = document.createElement('span');
  spanElement.textContent = url;

  var buttonElement = document.createElement('button');
  buttonElement.textContent = 'Remove';
  buttonElement.dataset.url = url;
  buttonElement.dataset.cacheName = cacheName;
  buttonElement.addEventListener('click', function() {
    remove(this.dataset.cacheName, this.dataset.url).then(function() {
      var parent = this.parentNode;
      var grandParent = parent.parentNode;
      grandParent.removeChild(parent);
    }.bind(this));
  });

  var liElement = document.createElement('li');
  liElement.appendChild(spanElement);
  liElement.appendChild(buttonElement);

  cacheEntriesUl.appendChild(liElement);
}

// Given a cache name and URL, removes the cached entry.
function remove(cacheName, url) {
  return window.caches.open(cacheName).then(function(cache) {
    return cache.delete(url);
  });
}

if ('caches' in window) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
    // As soon as the service worker has been installed, active the UI elements.
    navigator.serviceWorker.ready.then(initializeUI);
  }
} else {
  ChromeSamples.setStatus('window.caches is not supported in your browser.');
}

