var bluetoothDevice;

async function onButtonClick() {
  bluetoothDevice = null;
  try {
    log('Requesting any Bluetooth Device...');
    bluetoothDevice = await navigator.bluetooth.requestDevice({
        filters: anyNamedDevice()});
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
    connect();
  } catch(error) {
    log('Argh! ' + error);
  }
}

async function connect() {
  exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
    async function toTry() {
      time('Connecting to Bluetooth Device... ');
      await bluetoothDevice.gatt.connect();
    },
    function success() {
      log('> Bluetooth Device connected. Try disconnect it now.');
    },
    function fail() {
      time('Failed to reconnect.');
    });
}

function onDisconnected() {
  log('> Bluetooth Device disconnected');
  connect();
}

/* Utils */

// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
async function exponentialBackoff(max, delay, toTry, success, fail) {
  try {
    const result = await toTry();
    success(result);
  } catch(error) {
    if (max === 0) {
      return fail();
    }
    time('Retrying in ' + delay + 's... (' + max + ' tries left)');
    setTimeout(function() {
      exponentialBackoff(--max, delay * 2, toTry, success, fail);
    }, delay * 1000);
  }
}

function anyNamedDevice() {
  // This is the closest we can get for now to get all devices.
  // https://github.com/WebBluetoothCG/web-bluetooth/issues/234
  return Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      .map(c => ({namePrefix: c}))
      .concat({name: ''});
}

function time(text) {
  log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
}
