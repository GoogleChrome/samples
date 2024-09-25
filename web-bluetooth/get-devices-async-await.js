async function populateBluetoothDevices() {
  const devicesSelect = document.querySelector('#devicesSelect');
  try {
    log('Getting existing permitted Bluetooth devices...');
    const devices = await navigator.bluetooth.getDevices();

    log('> Got ' + devices.length + ' Bluetooth devices.');
    devicesSelect.textContent = '';
    for (const device of devices) {
      const option = document.createElement('option');
      option.value = device.id;
      option.textContent = device.name;
      devicesSelect.appendChild(option);
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
    populateBluetoothDevices();
  }
  catch(error) {
    log('Argh! ' + error);
  }
}

async function onForgetBluetoothDeviceButtonClick() {
  try {
    const devices = await navigator.bluetooth.getDevices();

    const deviceIdToForget = document.querySelector('#devicesSelect').value;
    const device = devices.find((device) => device.id == deviceIdToForget);
    if (!device) {
      throw new Error('No Bluetooth device to forget');
    }
    log('Forgetting ' + device.name + 'Bluetooth device...');
    await device.forget();

    log('  > Bluetooth device has been forgotten.');
    populateBluetoothDevices();
  }
  catch(error) {
    log('Argh! ' + error);
  }
}

window.onload = () => {
  populateBluetoothDevices();
};
