function onButtonClick() {
  let filters = [];

  let filterService = document.querySelector('#service').value;
  if (filterService.startsWith('0x')) {
    filterService = parseInt(filterService);
  }
  if (filterService) {
    filters.push({services: [filterService]});
  }

  let filterName = document.querySelector('#name').value;
  if (filterName) {
    filters.push({name: filterName});
  }

  let filterNamePrefix = document.querySelector('#namePrefix').value;
  if (filterNamePrefix) {
    filters.push({namePrefix: filterNamePrefix});
  }

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: filters})
  .then(device => {
    log('> Name:             ' + device.name);
    log('> Id:               ' + device.id);
    log('> Allowed Services: ' + device.uuids.join('\n' + ' '.repeat(20)));
    log('> Connected:        ' + device.gatt.connected);
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
