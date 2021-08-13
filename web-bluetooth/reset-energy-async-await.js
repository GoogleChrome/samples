async function onButtonClick() {
  try {
    log('Requesting Bluetooth Device...');
    const device  = await navigator.bluetooth.requestDevice({
        filters: [{services: [0x180D /* Heart Rate */]}]});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Heart Rate Service...');
    const service = await server.getPrimaryService(0x180D /* Heart Rate */);

    log('Getting Heart Rate Control Point Characteristic...');
    const characteristic = await service.getCharacteristic(0x2A39 /* Heart Rate Control Point */);

    log('Writing Heart Rate Control Point Characteristic...');
    // Writing 1 is the signal to reset energy expended.
    let resetEnergyExpended = Uint8Array.of(1);
    await characteristic.writeValue(resetEnergyExpended);

    log('> Energy expended has been reset.');
  } catch(error) {
    log('Argh! ' + error);
  }
}
