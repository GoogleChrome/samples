var dataNumber = 0;
var db = null;

var observer = new IDBObserver(changes => {
  var tabName = changes.records.get('name')[0].value;
  if (changes.records.get('data')[0].type === 'clear') {
    ChromeSamples.log(`Tab "${tabName}" reset data number to 0.`);
    setDataNumber(0);
  } else {
    var newDataValue = changes.records.get('data')[0].value;
    ChromeSamples.log(`Tab "${tabName}" set data number to ${newDataValue}.`);
    setDataNumber(newDataValue);
  }
});

function setDataNumber(number) {
  dataNumber = number;
  document.querySelector('#data').textContent = dataNumber;
}

function onIncrementButtonClick() {
  if (!db) {
    ChromeSamples.log('Database connection still opening.');
    return;
  }
  var name = document.querySelector('#name').textContent;
  var transaction = db.transaction(['data', 'name'], 'readwrite');
  // We wait for the first success to signify we've been scheduled.
  var request = transaction.objectStore('name').put(name, 'key');
  request.onsuccess = function() {
    var newDataNumber = dataNumber + 1;
    transaction.objectStore('data').put(newDataNumber, 'key');
    transaction.oncomplete = function() {
      setDataNumber(newDataNumber);
    };
  };
}

function onResetButtonClick() {
  if (!db) {
    ChromeSamples.log('Database connection still opening.');
    return;
  }
  var name = document.querySelector('#name').textContent;
  var transaction = db.transaction(['data', 'name'], 'readwrite');
  transaction.objectStore('name').put(name, 'key');
  transaction.objectStore('data').clear();
  transaction.oncomplete = function() {
    setDataNumber(0);
  };
}

var openRequest = indexedDB.open('demoDB');

openRequest.onupgradeneeded = function() {
  openRequest.result.createObjectStore('data');
  openRequest.result.createObjectStore('name');
};

openRequest.onsuccess = function(event) {
  db = event.target.result;

  var transaction = db.transaction(['data', 'name'], 'readonly');
  // Observe starting after this transaction!
  // Note: Including values can be a performance hit if they are large.
  observer.observe(db, transaction, {
    operationTypes: ['put', 'clear'], values: true});

  var getRequest = transaction.objectStore('data').get('key');
  getRequest.onsuccess = function(event) {
    var result = event.target.result;
    if (result) {
      setDataNumber(result);
      ChromeSamples.log('Database has starting value of ' + result + '.');
    } else {
      setDataNumber(0);
      ChromeSamples.log('Database is empty, starting at 0.');
    }
  };
};

openRequest.onerror = function(event) {
  ChromeSamples.log('Error opening database: ', event.target.error);
};
