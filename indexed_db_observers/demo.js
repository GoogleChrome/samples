var dataField = document.querySelector('#data');
var nameField = document.querySelector('#name');
var incrementButton = document.querySelector('#incrementButton');

var dataNumber = 0;
var db = null;

var observer = new IDBObserver(function(changes) {
  var originTab = changes.records.get('name')[0].key.lower;
  var newDataValue = changes.records.get('data')[0].key.lower;
  ChromeSamples.log('Tab "' + originTab + '" set the data value to ' + newDataValue);
  dataNumber = newDataValue;
  dataField.innerHTML = dataNumber;
});

incrementButton.addEventListener('click', function(event) {
  if (db == null) {
    ChromeSamples.log('Database connection still openning.');
    return;
  }
  var transaction = db.transaction(['data', 'name'], 'readwrite');
  var dataStore = transaction.objectStore('data');
  var nameStore = transaction.objectStore('name');
  
  dataNumber++;
  dataStore.put(dataNumber, dataNumber);
  nameStore.put(nameField.innerHTML, nameField.innerHTML);
  transaction.oncomplete = function() {
    dataField.innerHTML = dataNumber;
  }
});

var openRequest = indexedDB.open('demoDB');
openRequest.onupgradeneeded = function() {
  openRequest.result.createObjectStore('name');
  openRequest.result.createObjectStore('data');
}
openRequest.onerror = function() {
    ChromeSamples.log('Error openning database: ', openRequest.error);
}
openRequest.onsuccess = function(event) {
  db = event.target.result;
  var transaction = db.transaction(['data', 'name'], 'readonly');
  // Observe starting after this transaction!
  observer.observe(db, transaction, {operationTypes: ['put']});
  // This is ugly because we have to use the keys. When value or
  // transaction support is available we will use that.
  var dataStore = transaction.objectStore('data');
  dataStore.getAllKeys().onsuccess = function(event) {
    var maxNumber = 0;
    if (event.target.result.length == 0) {
      dataNumber = maxNumber;
      dataField.innerHTML = dataNumber;
      return;
    }
    event.target.result.forEach(function(number) {
      maxNumber = maxNumber > number ? maxNumber : number;
    })
    dataNumber = maxNumber;
   dataField.innerHTML = dataNumber;
  }
}