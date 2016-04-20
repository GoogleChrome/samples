function onFormSubmit() {
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
    log('> Name:             ' + device.name);
    log('> Id:               ' + device.id);
    log('> UUIDs:            ' + device.uuids.join('\n' + ' '.repeat(20)));
    log('> Connected:        ' + device.gatt.connected);
    if (device.adData) {
      log('> Tx Power:         ' + device.adData.txPower + ' dBm');
      log('> RSSI:             ' + device.adData.rssi + ' dBm');
    }
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
