var myDescriptor;

async function onReadButtonClick() {
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

    log('Getting Descriptor...');
    myDescriptor = await characteristic.getDescriptor('gatt.characteristic_user_description');

    document.querySelector('#writeButton').disabled =
        !characteristic.properties.write;

    log('Reading Descriptor...');
    const value = await myDescriptor.readValue();

    let decoder = new TextDecoder('utf-8');
    log('> Characteristic User Description: ' + decoder.decode(value));
  } catch(error) {
    document.querySelector('#writeButton').disabled = true;
    log('Argh! ' + error);
  }
}

async function onWriteButtonClick() {
  if (!myDescriptor) {
    return;
  }
  let encoder = new TextEncoder('utf-8');
  let value = document.querySelector('#description').value;
  try {
    log('Setting Characteristic User Description...');
    await myDescriptor.writeValue(encoder.encode(value));

    log('> Characteristic User Description changed to: ' + value);
  } catch(error) {
    log('Argh! ' + error);
  }
}

