function onGetBluetoothDevicesButtonClick() {
  log('Getting existing permitted Bluetooth devices...');
  navigator.bluetooth.getDevices()
  .then(devices => {
    log('> Got ' + devices.length + ' Bluetooth devices.');
    for (const device of devices) {
      log('  > ' + device.name + ' (' + device.id + ')');
    }
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function onRequestBluetoothDeviceButtonClick() {
  log('Requesting any Bluetooth device...');
  navigator.bluetooth.requestDevice({
 // filters: [...] <- Prefer filters to save energy & show relevant devices.
    acceptAllDevices: true
  })
  .then(device => {
    log('> Requested ' + device.name + ' (' + device.id + ')');
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
