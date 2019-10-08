async function onButtonClick() {
  try {
    log('Requesting any Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true,
        optionalServices: ['device_information']});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Device Information Service...');
    const service = await server.getPrimaryService('device_information');

    log('Getting Device Information Characteristics...');
    const characteristics = await service.getCharacteristics();

    const decoder = new TextDecoder('utf-8');
    for (const characteristic of characteristics) {
      switch (characteristic.uuid) {

        case BluetoothUUID.getCharacteristic('manufacturer_name_string'):
          await characteristic.readValue().then(value => {
            log('> Manufacturer Name String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('model_number_string'):
          await characteristic.readValue().then(value => {
            log('> Model Number String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('hardware_revision_string'):
          await characteristic.readValue().then(value => {
            log('> Hardware Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('firmware_revision_string'):
          await characteristic.readValue().then(value => {
            log('> Firmware Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('software_revision_string'):
          await characteristic.readValue().then(value => {
            log('> Software Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('system_id'):
          await characteristic.readValue().then(value => {
            log('> System ID: ');
            log('  > Manufacturer Identifier: ' +
                padHex(value.getUint8(4)) + padHex(value.getUint8(3)) +
                padHex(value.getUint8(2)) + padHex(value.getUint8(1)) +
                padHex(value.getUint8(0)));
            log('  > Organizationally Unique Identifier: ' +
                padHex(value.getUint8(7)) + padHex(value.getUint8(6)) +
                padHex(value.getUint8(5)));
          });
          break;

        case BluetoothUUID.getCharacteristic('ieee_11073-20601_regulatory_certification_data_list'):
          await characteristic.readValue().then(value => {
            log('> IEEE 11073-20601 Regulatory Certification Data List: ' +
                decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('pnp_id'):
          await characteristic.readValue().then(value => {
            log('> PnP ID:');
            log('  > Vendor ID Source: ' +
                (value.getUint8(0) === 1 ? 'Bluetooth' : 'USB'));
            if (value.getUint8(0) === 1) {
              log('  > Vendor ID: ' +
                  (value.getUint8(1) | value.getUint8(2) << 8));
            } else {
              log('  > Vendor ID: ' +
                  getUsbVendorName(value.getUint8(1) | value.getUint8(2) << 8));
            }
            log('  > Product ID: ' +
                (value.getUint8(3) | value.getUint8(4) << 8));
            log('  > Product Version: ' +
                (value.getUint8(5) | value.getUint8(6) << 8));
          });
          break;

        default: log('> Unknown Characteristic: ' + characteristic.uuid);
      }
    }
  } catch(error) {
    log('Argh! ' + error);
  }
}

/* Utils */

function padHex(value) {
  return ('00' + value.toString(16).toUpperCase()).slice(-2);
}

function getUsbVendorName(value) {
  // Check out page source to see what valueToUsbVendorName object is.
  return value +
      (value in valueToUsbVendorName ? ' (' + valueToUsbVendorName[value] + ')' : '');
}
