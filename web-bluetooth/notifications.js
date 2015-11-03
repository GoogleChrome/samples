var myCharacteristic;

function onStartButtonClick() {
  var serviceUuid = document.getElementById('service').value;
  if (serviceUuid.startsWith('0x')) {
    serviceUuid = parseInt(serviceUuid, 16);
  }

  var characteristicUuid = document.getElementById('characteristic').value;
  if (characteristicUuid.startsWith('0x')) {
    characteristicUuid = parseInt(characteristicUuid, 16);
  }

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters:[{services:[ serviceUuid ]}]})
  .then(device => device.connectGATT())
  .then(server => server.getPrimaryService(serviceUuid))
  .then(service => service.getCharacteristic(characteristicUuid))
  .then(characteristic => {
    myCharacteristic = characteristic;
    return myCharacteristic.startNotifications().then(() => {
      log('> Notifications started');
      myCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);
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
      myCharacteristic.removeEventListener('characteristicvaluechanged', handleNotifications);
    });
  }
}

function handleNotifications(event) {
  var buffer = event.target.value;
  var data = new DataView(buffer);
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (var i = 0, a = []; i < data.byteLength; i++) {
    a.push(('00' + data.getUint8(i).toString(16)).slice(-2));
  }
  log('> ' + a.join(''));
}
