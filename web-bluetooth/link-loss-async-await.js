var alertLevelCharacteristic;

async function onReadButtonClick() {
  try {
    log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true,
        optionalServices: ['link_loss']});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Link Loss Service...');
    const service = await server.getPrimaryService('link_loss');

    log('Getting Alert Level Characteristic...');
    alertLevelCharacteristic = await service.getCharacteristic('alert_level');

    document.querySelector('#writeButton').disabled = false;
    log('Reading Alert Level...');
    const value = await alertLevelCharacteristic.readValue();

    log('> Alert Level: ' + getAlertLevel(value));
  } catch(error) {
    document.querySelector('#writeButton').disabled = true;
    log('Argh! ' + error);
  }
}

async function onWriteButtonClick() {
  if (!alertLevelCharacteristic) {
    return;
  }
  let value = Uint8Array.of(document.querySelector('#alertLevelValue').value);
  try {
    log('Setting Alert Level...');
    await alertLevelCharacteristic.writeValue(value);

    log('> Alert Level changed to: ' + getAlertLevel(new DataView(value.buffer)));
  } catch(error) {
    log('Argh! ' + error);
  }
}

/* Utils */

const valueToAlertLevel = {
  0x00: 'No Alert',
  0x01: 'Mild Alert',
  0x02: 'High Alert'
};

function getAlertLevel(value) {
  let v = value.getUint8(0);
  return v + (v in valueToAlertLevel ?
      ' (' + valueToAlertLevel[v] + ')' : 'Unknown');
}
