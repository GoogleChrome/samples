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
  // Caution: This may result in a bunch of unrelated devices being shown in the
  // chooser and energy being wasted as there are no filters. Use it with
  // caution.
  log('Requesting any Bluetooth device...'); 
  navigator.bluetooth.requestDevice({ acceptAllDevices: true })
  .then(device => {
    log('> Requested ' + device.name + ' (' + device.id + ')');
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
