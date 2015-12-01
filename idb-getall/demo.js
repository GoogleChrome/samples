var addButton = document.querySelector('#add');
var displayButton = document.querySelector('#display');

var DB_NAME = 'timestamps';
var DB_VERSION = 1;
var STORE_NAME = 'store';
var db;

var request = indexedDB.open(DB_NAME, DB_VERSION);
request.onupgradeneeded = function() {
  // Create a new object store if this is the first time we're using
  // this DB_NAME/DB_VERSION combo.
  request.result.createObjectStore(STORE_NAME, {autoIncrement: true});
};
request.onsuccess = function() {
  db = request.result;
  // Enable our buttons once the IndexedDB instance is available.
  addButton.disabled = false;
  displayButton.disabled = false;
};

addButton.addEventListener('click', function() {
  var transaction = db.transaction(STORE_NAME, 'readwrite');
  var objectStore = transaction.objectStore(STORE_NAME);
  // Add the current timestamp to IndexedDB.
  objectStore.put(Date.now()).onsuccess = function() {
    ChromeSamples.setStatus('Added timestamp to IndexedDB.');
  };
});

function logTimestamps(timestamps) {
  ChromeSamples.setStatus('There are ' + timestamps.length +
    ' timestamp(s) saved in IndexedDB: ' + timestamps.join(', '));
}

displayButton.addEventListener('click', function() {
  var transaction = db.transaction(STORE_NAME, 'readonly');
  var objectStore = transaction.objectStore(STORE_NAME);

  if ('getAll' in objectStore) {
    // IDBObjectStore.getAll() will return the full set of items in our store.
    objectStore.getAll().onsuccess = function(event) {
      logTimestamps(event.target.result);
    };
  } else {
    // Fallback to the traditional cursor approach if getAll isn't supported.
    var timestamps = [];
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        timestamps.push(cursor.value);
        cursor.continue();
      } else {
        logTimestamps(timestamps);
      }
    };
  }
});
