var bluetoothDevice;
var batteryLevelCharacteristic;

async function onReadBatteryLevelButtonClick() {
  try {
    if (!bluetoothDevice) {
      await requestDevice();
    }
    await connectDeviceAndCacheCharacteristics();

    log('Reading Battery Level...');
    await batteryLevelCharacteristic.readValue();
  } catch(error) {
    log('Argh! ' + error);
  }
}

async function requestDevice() {
  log('Requesting any Bluetooth Device...');
  bluetoothDevice = await navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: ['battery_service']});
  bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
}

async function connectDeviceAndCacheCharacteristics() {
  if (bluetoothDevice.gatt.connected && batteryLevelCharacteristic) {
    return;
  }

  log('Connecting to GATT Server...');
  const server = await bluetoothDevice.gatt.connect();

  log('Getting Battery Service...');
  const service = await server.getPrimaryService('battery_service');

  log('Getting Battery Level Characteristic...');
  batteryLevelCharacteristic = await service.getCharacteristic('battery_level');

  batteryLevelCharacteristic.addEventListener('characteristicvaluechanged',
      handleBatteryLevelChanged);
  document.querySelector('#startNotifications').disabled = false;
  document.querySelector('#stopNotifications').disabled = true;
}

/* This function will be called when `readValue` resolves and
 * characteristic value changes since `characteristicvaluechanged` event
 * listener has been added. */
function handleBatteryLevelChanged(event) {
  let batteryLevel = event.target.value.getUint8(0);
  log('> Battery Level is ' + batteryLevel + '%');
}

async function onStartNotificationsButtonClick() {
  try {
    log('Starting Battery Level Notifications...');
    await batteryLevelCharacteristic.startNotifications();

    log('> Notifications started');
    document.querySelector('#startNotifications').disabled = true;
    document.querySelector('#stopNotifications').disabled = false;
  } catch(error) {
    log('Argh! ' + error);
  }
}

async function onStopNotificationsButtonClick() {
  try {
    log('Stopping Battery Level Notifications...');
    await batteryLevelCharacteristic.stopNotifications();

    log('> Notifications stopped');
    document.querySelector('#startNotifications').disabled = false;
    document.querySelector('#stopNotifications').disabled = true;
  } catch(error) {
    log('Argh! ' + error);
  }
}

function onResetButtonClick() {
  if (batteryLevelCharacteristic) {
    batteryLevelCharacteristic.removeEventListener('characteristicvaluechanged',
        handleBatteryLevelChanged);
    batteryLevelCharacteristic = null;
  }
  // Note that it doesn't disconnect device.
  bluetoothDevice = null;
  log('> Bluetooth Device reset');
}

async function onDisconnected() {
  log('> Bluetooth Device disconnected');
  try {
    await connectDeviceAndCacheCharacteristics()
  } catch(error) {
    log('Argh! ' + error);
  }
}
