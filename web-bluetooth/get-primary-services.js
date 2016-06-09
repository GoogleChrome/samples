function onButtonClick() {
  let filterName = document.querySelector('#name').value;

  let services = document.querySelector('#services').value.split(/, ?/)
    .map(s => s.startsWith('0x') ? parseInt(s) : s)
    .filter(s => s && BluetoothUUID.getService);

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({
    filters: [{name: filterName}],
    optionalServices: services
  })
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    // Note that we could also get all services that match a specific UUID by
    // simply passing it to getPrimaryServices().
    log('Getting Services...');
    return server.getPrimaryServices();
  })
  .then(services => {
    log('> Services: ' +
      services.map(s => s.uuid).join('\n' + ' '.repeat(19)));
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
