var bluetoothGattServer;

function onDisconnectButtonClick() {
  log('Disconnecting from Bluetooth Device...');
  if (bluetoothGattServer) {
    bluetoothGattServer.disconnect();
    log('Bluetooth Device connected: ' + bluetoothGattServer.connected);
  }
}

function onScanButtonClick() {
  'use strict';

  let options = {filters: []};

  let filterService = document.getElementById('service').value;
  if (filterService.startsWith('0x')) {
    filterService = parseInt(filterService, 16);
  }
  if (filterService) {
    options.filters.push({services: [filterService]});
  }

  let filterName = document.getElementById('name').value;
  if (filterName) {
    options.filters.push({name: filterName});
  }

  let filterNamePrefix = document.getElementById('namePrefix').value;
  if (filterNamePrefix) {
    options.filters.push({namePrefix: filterNamePrefix});
  }

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    log('Connecting to Bluetooth Device...');
    return device.connectGATT();
  })
  .then(gattServer => {
    bluetoothGattServer = gattServer;
    log('Bluetooth Device connected: ' + bluetoothGattServer.connected);
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
