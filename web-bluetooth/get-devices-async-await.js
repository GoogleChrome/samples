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
    // Caution: This may result in a bunch of unrelated devices being shown in
    // the chooser and energy being wasted as there are no filters. Use it with
    // caution.
    log('Requesting any Bluetooth device...'); 
    const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
    
    log('> Requested ' + device.name + ' (' + device.id + ')');
  }
  catch(error) {
    log('Argh! ' + error);
  }
}
