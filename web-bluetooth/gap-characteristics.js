function onButtonClick() {
  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: ['generic_access']})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting GAP Service...');
    return server.getPrimaryService('generic_access');
  })
  .then(service => {
    log('Getting GAP Characteristics...');
    return service.getCharacteristics();
  })
  .then(characteristics => {
    let queue = Promise.resolve();
    characteristics.forEach(characteristic => {
      switch (characteristic.uuid) {

        case BluetoothUUID.getCharacteristic('gap.appearance'):
          queue = queue.then(_ => readAppearanceValue(characteristic));
          break;

        case BluetoothUUID.getCharacteristic('gap.device_name'):
          queue = queue.then(_ => readDeviceNameValue(characteristic));
          break;

        case BluetoothUUID.getCharacteristic('gap.peripheral_preferred_connection_parameters'):
          queue = queue.then(_ => readPPCPValue(characteristic));
          break;

        case BluetoothUUID.getCharacteristic('gap.central_address_resolution_support'):
          queue = queue.then(_ => readCentralAddressResolutionSupportValue(characteristic));
          break;

        case BluetoothUUID.getCharacteristic('gap.peripheral_privacy_flag'):
          queue = queue.then(_ => readPeripheralPrivacyFlagValue(characteristic));
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

function readAppearanceValue(characteristic) {
  return characteristic.readValue().then(value => {
    log('> Appearance: ' +
        getDeviceType(value.getUint16(0, true /* Little Endian */)));
  });
}

function readDeviceNameValue(characteristic) {
  return characteristic.readValue().then(value => {
    log('> Device Name: ' + new TextDecoder().decode(value));
  });
}

function readPPCPValue(characteristic) {
  return characteristic.readValue().then(value => {
    log('> Peripheral Preferred Connection Parameters: ');
    log('  > Minimum Connection Interval: ' +
        (value.getUint8(0) | value.getUint8(1) << 8) * 1.25 + 'ms');
    log('  > Maximum Connection Interval: ' +
        (value.getUint8(2) | value.getUint8(3) << 8) * 1.25 + 'ms');
    log('  > Latency: ' +
        (value.getUint8(4) | value.getUint8(5) << 8) + 'ms');
    log('  > Connection Supervision Timeout Multiplier: ' +
        (value.getUint8(6) | value.getUint8(7) << 8));
  });
}

function readCentralAddressResolutionSupportValue(characteristic) {
  return characteristic.readValue().then(value => {
    let supported = value.getUint8(0);
    if (supported === 0) {
      log('> Central Address Resolution: Not Supported');
    } else if (supported === 1) {
      log('> Central Address Resolution: Supported');
    } else {
      log('> Central Address Resolution: N/A');
    }
  });
}

function readPeripheralPrivacyFlagValue(characteristic) {
  return characteristic.readValue().then(value => {
    let flag = value.getUint8(0);
    if (flag === 1) {
      log('> Peripheral Privacy Flag: Enabled');
    } else {
      log('> Peripheral Privacy Flag: Disabled');
    }
  });
}

/* Utils */

function getDeviceType(value) {
  // Check out page source to see what valueToDeviceType object is.
  return value +
      (value in valueToDeviceType ? ' (' + valueToDeviceType[value] + ')' : '');
}
