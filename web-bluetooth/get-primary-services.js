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
    log('Getting Primary Services...');
    //return server.getPrimaryServices();
    // TODO: Replace with above once getPrimaryServices land.
    return Promise.all([server.getPrimaryService('battery_service'),
                        server.getPrimaryService(0xff02)]);
  })
  .then(services => {
    log('Getting Characteristics...');
    return Promise.all(services.map(service => service.getCharacteristics()))
    .then(characteristics => {
      services.forEach((service, i) => {
        log('> Service: ' + service.uuid);
        characteristics[i].forEach(characteristic => {
          let supportedProperties = [];
          // TODO: Fix when Object.keys works on BluetoothCharacteristicProperties.
          for (p in characteristic.properties) { 
            if (characteristic.properties[p]) { supportedProperties.push(p); }
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
