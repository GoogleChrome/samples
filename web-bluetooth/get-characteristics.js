function onFormSubmit() {
  let serviceUuid = document.querySelector('#service').value;
  if (serviceUuid.startsWith('0x')) {
    serviceUuid = parseInt(serviceUuid);
  }

  let characteristicUuid = document.querySelector('#characteristic').value;
  if (characteristicUuid.startsWith('0x')) {
    characteristicUuid = parseInt(characteristicUuid);
  }

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: [serviceUuid]}]})
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService(serviceUuid))
  .then(service => {
    if (characteristicUuid) {
      // Get all characteristics that match this UUID.
      return service.getCharacteristics(characteristicUuid);
    }
    // Get all characteristics.
    return service.getCharacteristics();
  })
  .then(characteristics => {
    log('> Characteristics: ' +
      characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19)));
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
