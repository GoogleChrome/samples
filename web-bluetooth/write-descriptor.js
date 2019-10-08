var myDescriptor;

function onReadButtonClick() {
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
    log('Getting Descriptor...');
    return characteristic.getDescriptor('gatt.characteristic_user_description');
  })
  .then(descriptor => {
    document.querySelector('#writeButton').disabled =
        !descriptor.characteristic.properties.write;
    myDescriptor = descriptor;
    log('Reading Descriptor...');
    return descriptor.readValue();
  })
  .then(value => {
    let decoder = new TextDecoder('utf-8');
    log('> Characteristic User Description: ' + decoder.decode(value));
  })
  .catch(error => {
    document.querySelector('#writeButton').disabled = true;
    log('Argh! ' + error);
  });
}

function onWriteButtonClick() {
  if (!myDescriptor) {
    return;
  }
  let encoder = new TextEncoder('utf-8');
  let value = document.querySelector('#description').value;
  log('Setting Characteristic User Description...');
  myDescriptor.writeValue(encoder.encode(value))
  .then(_ => {
    log('> Characteristic User Description changed to: ' + value);
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
