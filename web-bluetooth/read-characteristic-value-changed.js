var bluetoothDevice;
var batteryLevelCharacteristic;

function onReadBatteryLevelButtonClick() {
  requestDevice()
  .then(connectDeviceAndCacheCharacteristics)
  .then(_ => {
    log('Reading Battery Level...');
    return batteryLevelCharacteristic.readValue();
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function requestDevice() {
  let result = Promise.resolve();
  if (!bluetoothDevice) {
    log('Requesting Bluetooth Device...');
    result = navigator.bluetooth.requestDevice(
      {filters: anyDevice(), optionalServices: ['battery_service']})
    .then(device => {
      bluetoothDevice = device;
    });
  }
  return result;
}

function connectDeviceAndCacheCharacteristics() {
  if (bluetoothDevice.gatt.connected && batteryLevelCharacteristic) {
    return Promise.resolve();
  }

  log('Connecting to GATT Server...');
  return bluetoothDevice.gatt.connect()
  .then(server => {
    log('Getting Battery Service...');
    return server.getPrimaryService('battery_service');
  })
  .then(service => {
    log('Getting Battery Level Characteristic...');
    return service.getCharacteristic('battery_level');
  })
  .then(characteristic => {
    batteryLevelCharacteristic = characteristic;
    batteryLevelCharacteristic.addEventListener('characteristicvaluechanged',
        handleBatteryLevelChanged);
    document.querySelector('#startNotifications').disabled = false;
    document.querySelector('#stopNotifications').disabled = true;
  });
}

/* This function will be called when `readValue` resolves and
 * characteristic value changes since `characteristicvaluechanged` event
 * listener has been added. */
function handleBatteryLevelChanged(event) {
  let batteryLevel = event.target.value.getUint8(0);
  log('> Battery Level is ' + batteryLevel + '%');
}

function onStartNotificationsButtonClick() {
  log('Starting Battery Level Notifications...');
  batteryLevelCharacteristic.startNotifications()
  .then(_ => {
    log('> Notifications started');
    document.querySelector('#startNotifications').disabled = true;
    document.querySelector('#stopNotifications').disabled = false;
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function onStopNotificationsButtonClick() {
  log('Stopping Battery Level Notifications...');
  batteryLevelCharacteristic.stopNotifications()
  .then(_ => {
    log('> Notifications stopped');
    document.querySelector('#startNotifications').disabled = false;
    document.querySelector('#stopNotifications').disabled = true;
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function onResetButtonClick() {
  batteryLevelCharacteristic.removeEventListener('characteristicvaluechanged',
      handleBatteryLevelChanged);
  batteryLevelCharacteristic = null;
  // Note that it doesn't disconnect device.
  bluetoothDevice = null;
  log('> Bluetooth Device reset');
}

/* Utils */

function anyDevice() {
  // This is the closest we can get for now to get all devices.
  // https://github.com/WebBluetoothCG/web-bluetooth/issues/234
  return Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      .map(c => ({namePrefix: c}))
      .concat({name: ''});
}
