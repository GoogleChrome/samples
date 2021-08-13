async function onButtonClick() {
  try {
    log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
        filters: [{services: [0x180F /* Battery */]}]});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Battery Service...');
    const service = await server.getPrimaryService(0x180F /* Battery */);

    log('Getting Battery Level Characteristic...');
    const characteristic = await service.getCharacteristic(0x2A19 /* Battery Level */);

    log('Reading Battery Level...');
    const value = await characteristic.readValue();

    log('> Battery Level is ' + value.getUint8(0) + '%');
  } catch(error) {
    log('Argh! ' + error);
  }
}
