async function onConnectToBluetoothDevicesButtonClick() {
  try {
    log('Getting existing permitted Bluetooth devices...');
    const devices = await navigator.bluetooth.getDevices();

    log('> Got ' + devices.length + ' Bluetooth devices.');
    // These devices may not be powered on or in range, so scan for
    // advertisement packets from them before connecting.
    for (const device of devices) {
      connectToBluetoothDevice(device);
    }
  }
  catch(error) {
    log('Argh! ' + error);
  }
}

async function connectToBluetoothDevice(device) {
  const abortController = new AbortController();

  device.addEventListener('advertisementreceived', async (event) => {
    log('> Received advertisement from "' + device.name + '"...');
    // Stop watching advertisements to conserve battery life.
    abortController.abort();
    log('Connecting to GATT Server from "' + device.name + '"...');
    try {
      await device.gatt.connect()
      log('> Bluetooth device "' +  device.name + ' connected.');
    }
    catch(error) {
      log('Argh! ' + error);
    }
  }, { once: true });

  try {
    log('Watching advertisements from "' + device.name + '"...');
    await device.watchAdvertisements({ signal: abortController.signal });
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

    log('> Requested ' + device.name);
  }
  catch(error) {
    log('Argh! ' + error);
  }
}
