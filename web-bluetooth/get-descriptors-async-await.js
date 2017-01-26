async function onButtonClick() {
  let serviceUuid = document.querySelector('#service').value;
  if (serviceUuid.startsWith('0x')) {
    serviceUuid = parseInt(serviceUuid);
  }

  let characteristicUuid = document.querySelector('#characteristic').value;
  if (characteristicUuid.startsWith('0x')) {
    characteristicUuid = parseInt(characteristicUuid);
  }

  try {
    log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
        filters: [{services: [serviceUuid]}]});
  
    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Service...');
    const service = await server.getPrimaryService(serviceUuid);

    log('Getting Characteristic...');
    const characteristic = await service.getCharacteristic(characteristicUuid);

    log('Getting Descriptors...');
    const descriptors = await characteristic.getDescriptors();

    log('> Descriptors: ' +
      descriptors.map(c => c.uuid).join('\n' + ' '.repeat(19)));
  } catch(error) {
    log('Argh! ' + error);
  }
}
