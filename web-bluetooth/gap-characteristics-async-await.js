async function onButtonClick() {
  try {
    log('Requesting any Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true,
        optionalServices: ['generic_access']});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting GAP Service...');
    const service = await server.getPrimaryService('generic_access');

    log('Getting GAP Characteristics...');
    const characteristics = await service.getCharacteristics();

    for (const characteristic of characteristics) {
      switch (characteristic.uuid) {

        case BluetoothUUID.getCharacteristic('gap.appearance'):
          await readAppearanceValue(characteristic);
          break;

        case BluetoothUUID.getCharacteristic('gap.device_name'):
          await readDeviceNameValue(characteristic);
          break;

        case BluetoothUUID.getCharacteristic('gap.peripheral_preferred_connection_parameters'):
          await readPPCPValue(characteristic);
          break;

        case BluetoothUUID.getCharacteristic('gap.central_address_resolution_support'):
          await readCentralAddressResolutionSupportValue(characteristic);
          break;

        case BluetoothUUID.getCharacteristic('gap.peripheral_privacy_flag'):
          await readPeripheralPrivacyFlagValue(characteristic);
          break;

        default: log('> Unknown Characteristic: ' + characteristic.uuid);
      }
    }
  } catch(error) {
    log('Argh! ' + error);
  }
}

async function readAppearanceValue(characteristic) {
  const value = await characteristic.readValue();
  log('> Appearance: ' +
      getDeviceType(value.getUint16(0, true /* Little Endian */)));
}

async function readDeviceNameValue(characteristic) {
  const value = await characteristic.readValue();
  log('> Device Name: ' + new TextDecoder().decode(value));
}

async function readPPCPValue(characteristic) {
  const value = await characteristic.readValue();
  log('> Peripheral Preferred Connection Parameters: ');
  log('  > Minimum Connection Interval: ' +
      (value.getUint8(0) | value.getUint8(1) << 8) * 1.25 + 'ms');
  log('  > Maximum Connection Interval: ' +
      (value.getUint8(2) | value.getUint8(3) << 8) * 1.25 + 'ms');
  log('  > Latency: ' +
      (value.getUint8(4) | value.getUint8(5) << 8) + 'ms');
  log('  > Connection Supervision Timeout Multiplier: ' +
      (value.getUint8(6) | value.getUint8(7) << 8));
}

async function readCentralAddressResolutionSupportValue(characteristic) {
  const value = await characteristic.readValue();
  const supported = value.getUint8(0);
  if (supported === 0) {
    log('> Central Address Resolution: Not Supported');
  } else if (supported === 1) {
    log('> Central Address Resolution: Supported');
  } else {
    log('> Central Address Resolution: N/A');
  }
}

async function readPeripheralPrivacyFlagValue(characteristic) {
  const value = await characteristic.readValue();
  const flag = value.getUint8(0);
  if (flag === 1) {
    log('> Peripheral Privacy Flag: Enabled');
  } else {
    log('> Peripheral Privacy Flag: Disabled');
  }
}

/* Utils */

function getDeviceType(value) {
  // Check out page source to see what valueToDeviceType object is.
  return value +
      (value in valueToDeviceType ? ' (' + valueToDeviceType[value] + ')' : '');
}
