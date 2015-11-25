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
  [addButton, displayButton].forEach(function(button) {
    button.disabled = false;
  });
};

addButton.addEventListener('click', function() {
  var transaction = db.transaction(STORE_NAME, 'readwrite');
  var objectStore = transaction.objectStore(STORE_NAME);
  // Add the current timestamp to IndexedDB.
  objectStore.put(Date.now()).onsuccess = function() {
    ChromeSamples.setStatus('Added timestamp to IndexedDB.');
  };
});

displayButton.addEventListener('click', function() {
  var transaction = db.transaction(STORE_NAME, 'readonly');
  var objectStore = transaction.objectStore(STORE_NAME);
  // IDBObjectStore.getAll() will return the full set of items in our store.
  objectStore.getAll().onsuccess = function(event) {
    var timestamps = event.target.result;
    ChromeSamples.setStatus('There are ' + timestamps.length +
      ' timestamps saved in IndexedDB: ' + timestamps.join(', '));
  };
});
