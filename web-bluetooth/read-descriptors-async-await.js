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
    log('Requesting any Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true, optionalServices: [serviceUuid]});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Service...');
    const service = await server.getPrimaryService(serviceUuid);

    log('Getting Characteristic...');
    const characteristic = await service.getCharacteristic(characteristicUuid);

    log('Getting Descriptors...');
    const descriptors = await characteristic.getDescriptors();

    for (const descriptor of descriptors) {
      switch (descriptor.uuid) {

        case BluetoothUUID.getDescriptor('gatt.client_characteristic_configuration'):
          await descriptor.readValue().then(value => {
            log('> Client Characteristic Configuration:');
            let notificationsBit = value.getUint8(0) & 0b01;
            log('  > Notifications: ' + (notificationsBit ? 'ON' : 'OFF'));
            let indicationsBit = value.getUint8(0) & 0b10;
            log('  > Indications: ' + (indicationsBit ? 'ON' : 'OFF'));
          });
          break;

        case BluetoothUUID.getDescriptor('gatt.characteristic_user_description'):
          await descriptor.readValue().then(value => {
            let decoder = new TextDecoder('utf-8');
            log('> Characteristic User Description: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getDescriptor('report_reference'):
          await descriptor.readValue().then(value => {
            log('> Report Reference:');
            log('  > Report ID: ' + value.getUint8(0));
            log('  > Report Type: ' + getReportType(value));
          });
          break;

        default: log('> Unknown Descriptor: ' + descriptor.uuid);
      }
    }
  } catch(error) {
    log('Argh! ' + error);
  }
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
