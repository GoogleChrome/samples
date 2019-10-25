function onButtonClick() {
  let serviceUuid = document.querySelector('#service').value;
  if (serviceUuid.startsWith('0x')) {
    serviceUuid = parseInt(serviceUuid);
  }

  let characteristicUuid = document.querySelector('#characteristic').value;
  if (characteristicUuid.startsWith('0x')) {
    characteristicUuid = parseInt(characteristicUuid);
  }

  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
  // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: [serviceUuid]})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Service...');
    return server.getPrimaryService(serviceUuid);
  })
  .then(service => {
    log('Getting Characteristic...');
    return service.getCharacteristic(characteristicUuid);
  })
  .then(characteristic => {
    log('Getting Descriptors...');
    return characteristic.getDescriptors();
  })
  .then(descriptors => {
    let queue = Promise.resolve();
    descriptors.forEach(descriptor => {
      switch (descriptor.uuid) {

        case BluetoothUUID.getDescriptor('gatt.client_characteristic_configuration'):
          queue = queue.then(_ => descriptor.readValue()).then(value => {
            log('> Client Characteristic Configuration:');
            let notificationsBit = value.getUint8(0) & 0b01;
            log('  > Notifications: ' + (notificationsBit ? 'ON' : 'OFF'));
            let indicationsBit = value.getUint8(0) & 0b10;
            log('  > Indications: ' + (indicationsBit ? 'ON' : 'OFF'));
          });
          break;

        case BluetoothUUID.getDescriptor('gatt.characteristic_user_description'):
          queue = queue.then(_ => descriptor.readValue()).then(value => {
            let decoder = new TextDecoder('utf-8');
            log('> Characteristic User Description: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getDescriptor('report_reference'):
          queue = queue.then(_ => descriptor.readValue()).then(value => {
            log('> Report Reference:');
            log('  > Report ID: ' + value.getUint8(0));
            log('  > Report Type: ' + getReportType(value));
          });
          break;

        default: log('> Unknown Descriptor: ' + descriptor.uuid);
      }
    });
    return queue;
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

/* Utils */

const valueToReportType = {
  1: 'Input Report',
  2: 'Output Report',
  3: 'Feature Report'
};

function getReportType(value) {
  let v = value.getUint8(1);
  return v + (v in valueToReportType ?
      ' (' + valueToReportType[v] + ')' : 'Unknown');
}
