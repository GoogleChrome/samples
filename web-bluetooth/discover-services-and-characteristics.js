function onButtonClick() {
  let services = document.querySelector('#optionalServices').value.split(/, ?/)
    .map(s => s.startsWith('0x') ? parseInt(s) : s)
    .filter(s => s && BluetoothUUID.getService);

  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
    filters: anyDevice(),
    optionalServices: services
  })
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    if (!services.length) {
      return Promise.reject('Please enter some services first!');
    }
    // Note that we could also get all services that match a specific UUID by
    // simply passing it to getPrimaryServices().
    log('Getting Services...');
    return server.getPrimaryServices();
  })
  .then(services => {
    log('Getting Characteristics...');
    return Promise.all(services.map(service => service.getCharacteristics()))
    .then(allCharacteristics => {
      // Looping through all services to print their characteristics.
      services.forEach((service, i) => {
        log('> Service: ' + service.uuid);
        allCharacteristics[i].forEach(characteristic => {
          let supportedProperties = [];
          // We only want to print supported properties.
          for (const p in characteristic.properties) {
            if (characteristic.properties[p]) {
              supportedProperties.push(p);
            }
          }
          log('> Characteristic: ' + characteristic.uuid +
            ' - ' + supportedProperties.join(', '));
        });
      });
    });
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

/* Utils */

function anyDevice() {
  // This is the closest we can get for now to get all devices.
  // https://github.com/WebBluetoothCG/web-bluetooth/issues/234
  return Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      .map(c => ({namePrefix: c}))
      .concat({name: ''});
}
