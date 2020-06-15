async function onGetBluetoothDevicesButtonClick() {
  try {
    log('Getting existing permitted Bluetooth devices...');
    const devices = await navigator.bluetooth.getDevices();

    log('> Got ' + devices.length + ' Bluetooth devices.');
    for (const device of devices) {
      log('  > ' + device.name + ' (' + device.id + ')');
    }
  }
  catch(error) {
    log('Argh! ' + error);
  }
}

async function onRequestBluetoothDeviceButtonClick() {
  try {
    log('Requesting any Bluetooth device...');
    const device = await navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true
    });

    log('> Requested ' + device.name + ' (' + device.id + ')');
  }
  catch(error) {
    log('Argh! ' + error);
  }
}
