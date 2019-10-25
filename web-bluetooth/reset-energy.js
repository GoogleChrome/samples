function onButtonClick() {
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: ['heart_rate']}]})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Heart Rate Service...');
    return server.getPrimaryService('heart_rate');
  })
  .then(service => {
    log('Getting Heart Rate Control Point Characteristic...');
    return service.getCharacteristic('heart_rate_control_point');
  })
  .then(characteristic => {
    log('Writing Heart Rate Control Point Characteristic...');

    // Writing 1 is the signal to reset energy expended.
    let resetEnergyExpended = Uint8Array.of(1);
    return characteristic.writeValue(resetEnergyExpended);
  })
  .then(_ => {
    log('> Energy expended has been reset.');
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
