function onConnectToBluetoothDevicesButtonClick() {
  log('Getting existing permitted Bluetooth devices...');
  navigator.bluetooth.getDevices()
  .then(devices => {
    log('> Got ' + devices.length + ' Bluetooth devices.');
    // These devices may not be powered on or in range, so scan for
    // advertisement packets from them before connecting.
    for (const device of devices) {
      connectToBluetoothDevice(device);
    }
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function connectToBluetoothDevice(device) {
  const abortController = new AbortController();

  device.addEventListener('advertisementreceived', (event) => {
    log('> Received advertisement from "' + device.name + '"...');
    // Stop watching advertisements to conserve battery life.
    abortController.abort();
    log('Connecting to GATT Server from "' + device.name + '"...');
    device.gatt.connect()
    .then(() => {
      log('> Bluetooth device "' +  device.name + ' connected.');
    })
    .catch(error => {
      log('Argh! ' + error);
    });
  }, { once: true });

  log('Watching advertisements from "' + device.name + '"...');
  device.watchAdvertisements({ signal: abortController.signal })
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
    log('> Requested ' + device.name);
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}
