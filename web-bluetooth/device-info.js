function onFormSubmit() {
  'use strict';

  let filterService = document.getElementById('service').value;
  if (filterService.startsWith('0x')) {
    filterService = parseInt(filterService, 16);
  }

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters:[{services:[ filterService ]}]})
  .then(device => {
    log('> Device Name:   ' + device.name);
    log('> Device Id:     ' + device.id);
    log('> Device Paired: ' + device.paired);
    log('> Device Class:  ' + device.deviceClass);
    log('> Device UUIDs:  ' + device.uuids.join('\n' + ' '.repeat(17)));
    if (device.adData) {
      log('> Tx Power:      ' + device.adData.txPower + ' dBm');
      log('> RSSI:          ' + device.adData.rssi + ' dBm');
    }
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
