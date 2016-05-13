function onButtonClick() {
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(
    {filters: [{ name: '' }], optionalServices: ['generic_access']})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Generic Access Profile...');
    return server.getPrimaryService('generic_access');
  })
  .then(service => {
    log('Getting GAP Characteristics...');
    return service.getCharacteristics();
  })
  .then(characteristics => {
    characteristics.forEach(characteristic => {
      switch (characteristic.uuid) {

        case BluetoothUUID.getCharacteristic('gap.appearance'):
          characteristic.readValue().then(value => {
            log('> Appearance: ' +
                getDeviceType(value.getUint16(0, true /* Little Endian */)));
          });
          break;

        case BluetoothUUID.getCharacteristic('gap.device_name'):
          characteristic.readValue().then(value => {
            log('> Device Name: ' + new TextDecoder().decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('gap.peripheral_preferred_connection_parameters'):
          characteristic.readValue().then(value => {
            log('> Peripheral Preferred Connection Parameters: ');
            log('  >  Minimum Connection Interval: ' +
                (value.getUint8(0) | value.getUint8(1) << 8) * 1.25 + 'ms');
            log('  >  Maximum Connection Interval: ' +
                (value.getUint8(2) | value.getUint8(3) << 8) * 1.25 + 'ms');
            log('  >  Slave Latency: ' +
                (value.getUint8(4) | value.getUint8(5) << 8) + 'ms');
            log('  >  Connection Supervision Timeout Multiplier: ' +
                (value.getUint8(6) | value.getUint8(7) << 8));
          });
          break;

        case BluetoothUUID.getCharacteristic('gap.central_address_resolution_support'):
          characteristic.readValue().then(value => {
            let supported = value.getUint8(0);
            if (supported === 0) {
              log('> Central Address Resolution: Not Supported');
            } else if (supported === 1) {
              log('> Central Address Resolution: Supported');
            } else {
              log('> Central Address Resolution: N/A');
            }
          });
          break;

        case BluetoothUUID.getCharacteristic('gap.peripheral_privacy_flag'):
          characteristic.readValue().then(value => {
            let flag = value.getUint8(0);
            if (flag === 1) {
              log('> Peripheral Privacy Flag: Enabled');
            } else {
              log('> Peripheral Privacy Flag: Disabled');
            }
          });
          break;

        default: log('> Unknown Characteristic: ' + characteristic.uuid);
      }
    });
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function getDeviceType(value) {
  switch (value) {
    case 0:
      return value + ' (Unknown)';
    case 64:
      return value + ' (Generic Phone)';
    case 128:
      return value + ' (Generic Computer)';
    case 192:
      return value + ' (Generic Watch)';
    case 193:
      return value + ' (Watch: Sports Watch)';
    case 256:
      return value + ' (Generic Clock)';
    case 320:
      return value + ' (Generic Display)';
    case 384:
      return value + ' (Generic Remote Control)';
    case 448:
      return value + ' (Generic Eye-glasses)';
    case 512:
      return value + ' (Generic Tag)';
    case 576:
      return value + ' (Generic Keyring)';
    case 640:
      return value + ' (Generic Media Player)';
    case 704:
      return value + ' (Generic Barcode Scanner)';
    case 768:
      return value + ' (Generic Thermometer)';
    case 769:
      return value + ' (Thermometer: Ear)';
    case 832:
      return value + ' (Generic Heart rate Sensor)';
    case 833:
      return value + ' (Heart Rate Sensor: Heart Rate Belt)';
    case 896:
      return value + ' (Generic Blood Pressure)';
    case 897:
      return value + ' (Blood Pressure: Arm)';
    case 898:
      return value + ' (Blood Pressure: Wrist)';
    case 960:
      return value + ' (Human Interface Device (HID))';
    case 961:
      return value + ' (Keyboard)';
    case 962:
      return value + ' (Mouse)';
    case 963:
      return value + ' (Joystick)';
    case 964:
      return value + ' (Gamepad)';
    case 965:
      return value + ' (Digitizer Tablet)';
    case 966:
      return value + ' (Card Reader)';
    case 967:
      return value + ' (Digital Pen)';
    case 968:
      return value + ' (Barcode Scanner)';
    case 1024:
      return value + ' (Generic Glucose Meter)';
    case 1088:
      return value + ' (Generic: Running Walking Sensor)';
    case 1089:
      return value + ' (Running Walking Sensor: In-Shoe)';
    case 1090:
      return value + ' (Running Walking Sensor: On-Shoe)';
    case 1091:
      return value + ' (Running Walking Sensor: On-Hip)';
    case 1152:
      return value + ' (Generic: Cycling)';
    case 1153:
      return value + ' (Cycling: Cycling Computer)';
    case 1154:
      return value + ' (Cycling: Speed Sensor)';
    case 1155:
      return value + ' (Cycling: Cadence Sensor)';
    case 1156:
      return value + ' (Cycling: Power Sensor)';
    case 1157:
      return value + ' (Cycling: Speed and Cadence Sensor)';
    case 3136:
      return value + ' (Generic: Pulse Oximeter)';
    case 3137:
      return value + ' (Fingertip)';
    case 3138:
      return value + ' (Wrist Worn)';
    case 3200:
      return value + ' (Generic: Weight Scale)';
    case 5184:
      return value + ' (Generic: Outdoor Sports Activity)';
    case 5185:
      return value + ' (Location Display Device)';
    case 5186:
      return value + ' (Location and Navigation Display Device)';
    case 5187:
      return value + ' (Location Pod)';
    case 5188:
      return value + ' (Location and Navigation Pod)';
    case 5696:
      return value + ' (Generic: Environmental Sensor)';
    default:
      return value;
  }
}
