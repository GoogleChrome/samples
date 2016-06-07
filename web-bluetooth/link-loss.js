var alertLevelCharacteristic;

function onReadButtonClick() {
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: ['link_loss']}]})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Link Loss Service...');
    return server.getPrimaryService('link_loss');
  })
  .then(service => {
    log('Getting Alert Level Characteristic...');
    return service.getCharacteristic('alert_level');
  })
  .then(characteristic => {
    alertLevelCharacteristic = characteristic;
    document.querySelector('#writeButton').disabled = false;
    log('Reading Alert Level...');
    return characteristic.readValue();
  })
  .then(value => {
    log('> Alert Level: ' + getAlertLevel(value));
  })
  .catch(error => {
    document.querySelector('#writeButton').disabled = true;
    log('Argh! ' + error);
  });
}

function onWriteButtonClick() {
  if (!alertLevelCharacteristic) {
    return;
  }
  log('Setting Alert Level...');
  let value = document.querySelector('#alertLevelValue').value;
  alertLevelCharacteristic.writeValue(new Uint8Array([value]))
  .then(_ => {
    log('> Alert Level changed to: ' +
        getAlertLevel(alertLevelCharacteristic.value));
  })
  .catch(error => {
    log('Argh! ' + error);
  });
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
