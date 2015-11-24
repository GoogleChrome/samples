var DB_NAME = 'timestamps';
var DB_VERSION = 1;
var STORE_NAME = 'store';
var dbInstance;

// Simple Promise-based wrapper around getting an IndexedDB instance.
function getDB() {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise(function(resolve) {
    var request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function() {
      request.result.createObjectStore(STORE_NAME, {autoIncrement: true});
    };

    request.onsuccess = function() {
      dbInstance = request.result;
      resolve(dbInstance);
    };
  });
}


document.querySelector('#add').addEventListener('click', function(event) {
  getDB().then(function(db) {
    var transaction = db.transaction(STORE_NAME, 'readwrite');
    var objectStore = transaction.objectStore(STORE_NAME);
    objectStore.put(Date.now());
  }).catch(function(error) {
    ChromeSamples.setStatus(error);
  });
});

document.querySelector('#display').addEventListener('click', function(event) {
  getDB().then(function(db) {
    var transaction = db.transaction(STORE_NAME, 'readonly');
    var objectStore = transaction.objectStore(STORE_NAME);
    // IDBObjectStore.getAll() will return the full set of items in our store.
    objectStore.getAll().onsuccess = function(event) {
      var timestamps = event.target.result;
      ChromeSamples.setStatus('There are ' + timestamps.length + ' timestamps saved in IndexedDB: '
        + timestamps.join(', '));
    };
  }).catch(function(error) {
    ChromeSamples.setStatus(error);
  });
});
