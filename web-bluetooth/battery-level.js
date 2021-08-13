function onButtonClick() {
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(
    {filters: [{services: [0x180F /* Battery */]}]})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Battery Service...');
    return server.getPrimaryService(0x180F /* Battery */);
  })
  .then(service => {
    log('Getting Battery Level Characteristic...');
    return service.getCharacteristic(0x2A19 /* Battery Level */);
  })
  .then(characteristic => {
    log('Reading Battery Level...');
    return characteristic.readValue();
  })
  .then(value => {
    let batteryLevel = value.getUint8(0);
    log('> Battery Level is ' + batteryLevel + '%');
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
