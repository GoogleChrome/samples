var bluetoothDevice;

function onScanButtonClick() {
  let options = {filters: []};

  let filterService = document.querySelector('#service').value;
  if (filterService.startsWith('0x')) {
    filterService = parseInt(filterService);
  }
  if (filterService) {
    options.filters.push({services: [filterService]});
  }

  let filterName = document.querySelector('#name').value;
  if (filterName) {
    options.filters.push({name: filterName});
  }

  let filterNamePrefix = document.querySelector('#namePrefix').value;
  if (filterNamePrefix) {
    options.filters.push({namePrefix: filterNamePrefix});
  }

  bluetoothDevice = null;
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    bluetoothDevice = device;
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
    return connect();
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function connect() {
  log('Connecting to Bluetooth Device...');
  return bluetoothDevice.gatt.connect()
  .then(server => {
    log('> Bluetooth Device connected');
  });
}

function onDisconnectButtonClick() {
  if (!bluetoothDevice) {
    return;
  }
  log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
  } else {
    log('> Bluetooth Device is already disconnected');
  }
}

function onDisconnected(event) {
  // Object event.target is Bluetooth Device getting disconnected.
  log('> Bluetooth Device disconnected');
}


function onReconnectButtonClick() {
  if (!bluetoothDevice) {
    return;
  }
  if (bluetoothDevice.gatt.connected) {
    log('> Bluetooth Device is already connected');
    return;
  }
  connect()
  .catch(error => {
    log('Argh! ' + error);
  });
}
