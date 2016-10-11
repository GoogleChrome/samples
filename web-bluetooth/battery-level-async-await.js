async function onButtonClick() {
  try {
    log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
        filters: [{services: ['battery_service']}]});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Battery Service...');
    const service = await server.getPrimaryService('battery_service');

    log('Getting Battery Level Characteristic...');
    const characteristic = await service.getCharacteristic('battery_level');

    log('Reading Battery Level...');
    const value = await characteristic.readValue();

    log('> Battery Level is ' + value.getUint8(0) + '%');
  } catch(error) {
    log('Argh! ' + error);
  }
}
