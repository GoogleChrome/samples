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
    log('> Device UUIDs:  ' + device.uuids.join('\n' + ' '.repeat(21)));
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
