'use strict';
var myCharacteristic;

function onStartButtonClick() {
  let serviceUuid = document.getElementById('service').value;
  if (serviceUuid.startsWith('0x')) {
    serviceUuid = parseInt(serviceUuid, 16);
  }

  let characteristicUuid = document.getElementById('characteristic').value;
  if (characteristicUuid.startsWith('0x')) {
    characteristicUuid = parseInt(characteristicUuid, 16);
  }

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: [serviceUuid]}]})
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService(serviceUuid))
  .then(service => service.getCharacteristic(characteristicUuid))
  .then(characteristic => {
    myCharacteristic = characteristic;
    return myCharacteristic.startNotifications().then(() => {
      log('> Notifications started');
      myCharacteristic.addEventListener('characteristicvaluechanged',
        handleNotifications);
    });
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function onStopButtonClick() {
  if (myCharacteristic) {
    myCharacteristic.stopNotifications().then(() => {
      log('> Notifications stopped');
      myCharacteristic.removeEventListener('characteristicvaluechanged',
        handleNotifications);
    });
  }
}

function handleNotifications(event) {
  let value = event.target.value;
  // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
  value = value.buffer ? value : new DataView(value);
  let a = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (var i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  log('> ' + a.join(' '));
}
