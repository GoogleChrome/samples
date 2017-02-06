async function onButtonClick() {
  try {
    log('Requesting Bluetooth Device...');
    const device  = await navigator.bluetooth.requestDevice({
        filters: [{services: ['heart_rate']}]});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Heart Rate Service...');
    const service = await server.getPrimaryService('heart_rate');

    log('Getting Heart Rate Control Point Characteristic...');
    const characteristic = await service.getCharacteristic('heart_rate_control_point');

    log('Writing Heart Rate Control Point Characteristic...');
    // Writing 1 is the signal to reset energy expended.
    let resetEnergyExpended = Uint8Array.of(1);
    await characteristic.writeValue(resetEnergyExpended);

    log('> Energy expended has been reset.');
  } catch(error) {
    log('Argh! ' + error);
  }
}
