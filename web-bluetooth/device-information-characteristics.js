function onButtonClick() {
  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: ['device_information']})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Device Information Service...');
    return server.getPrimaryService('device_information');
  })
  .then(service => {
    log('Getting Device Information Characteristics...');
    return service.getCharacteristics();
  })
  .then(characteristics => {
    let queue = Promise.resolve();
    let decoder = new TextDecoder('utf-8');
    characteristics.forEach(characteristic => {
      switch (characteristic.uuid) {

        case BluetoothUUID.getCharacteristic('manufacturer_name_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            log('> Manufacturer Name String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('model_number_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            log('> Model Number String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('hardware_revision_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            log('> Hardware Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('firmware_revision_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            log('> Firmware Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('software_revision_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            log('> Software Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('system_id'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
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
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            log('> IEEE 11073-20601 Regulatory Certification Data List: ' +
                decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('pnp_id'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
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
    });
    return queue;
  })
  .catch(error => {
    log('Argh! ' + error);
  });
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
