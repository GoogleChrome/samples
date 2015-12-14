function onButtonClick() {
  'use strict';

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(
    {filters: [{services: ['battery_service']}]})
  .then(device => {
    log('> Found ' + device.name);
    log('Connecting to GATT Server...');
    return device.connectGATT();
  })
  .then(server => {
    log('Getting Battery Service...');
    return server.getPrimaryService('battery_service');
  })
  .then(service => {
    log('Getting Battery Level Characteristic...');
    return service.getCharacteristic('battery_level');
  })
  .then(characteristic => {
    log('Reading Battery Level...');
    return characteristic.readValue();
  })
  .then(buffer => {
    let data = new DataView(buffer);
    let batteryLevel = data.getUint8(0);
    log('> Battery Level is ' + batteryLevel + '%');
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
