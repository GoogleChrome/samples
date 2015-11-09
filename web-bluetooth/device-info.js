function onFormSubmit() {
  'use strict';

  let options = { filters : []};

  let filterService = document.getElementById('service').value;
  if (filterService.startsWith('0x')) {
    filterService = parseInt(filterService, 16);
  }
  if (filterService) {
    options.filters.push({services: [ filterService ]});
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
    log('> Device Name:   ' + device.name);
    log('> Device Id:     ' + device.id);
    log('> Device Paired: ' + device.paired);
    log('> Device Class:  ' + device.deviceClass);
    log('> Device UUIDs:  ' + device.uuids.join('\n' + ' '.repeat(17)));
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
