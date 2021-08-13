function onButtonClick() {
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: [0x180D /* Heart Rate */]}]})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Heart Rate Service...');
    return server.getPrimaryService(0x180D /* Heart Rate */);
  })
  .then(service => {
    log('Getting Heart Rate Control Point Characteristic...');
    return service.getCharacteristic(0x2A39 /* Heart Rate Control Point */);
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
