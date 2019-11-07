async function onButtonClick() {
  let filters = [];

  let filterName = document.querySelector('#name').value;
  if (filterName) {
    filters.push({name: filterName});
  }

  let filterNamePrefix = document.querySelector('#namePrefix').value;
  if (filterNamePrefix) {
    filters.push({namePrefix: filterNamePrefix});
  }

  let options = {};
  if (document.querySelector('#allAdvertisements').checked) {
    options.acceptAllAdvertisements = true;
  } else {
    options.filters = filters;
  }

  try {
    log('Requesting Bluetooth Scan with options: ' + JSON.stringify(options));
    const scan = await navigator.bluetooth.requestLEScan(options);

    log('Scan started with:');
    log(' acceptAllAdvertisements: ' + scan.acceptAllAdvertisements);
    log(' active: ' + scan.active);
    log(' keepRepeatedDevices: ' + scan.keepRepeatedDevices);
    log(' filters: ' + JSON.stringify(scan.filters));

    navigator.bluetooth.addEventListener('advertisementreceived', event => {
      log('Advertisement received.');
      log('  Device Name: ' + event.device.name);
      log('  Device ID: ' + event.device.id);
      log('  RSSI: ' + event.rssi);
      log('  TX Power: ' + event.txPower);
      log('  UUIDs: ' + event.uuids);
      event.manufacturerData.forEach((valueDataView, key) => {
        logDataView('Manufacturer', key, valueDataView);
      });
      event.serviceData.forEach((valueDataView, key) => {
        logDataView('Service', key, valueDataView);
      });
    });

    setTimeout(stopScan, 10000);
    function stopScan() {
      log('Stopping scan...');
      scan.stop();
      log('Stopped.  scan.active = ' + scan.active);
    }
  } catch(error)  {
    log('Argh! ' + error);
  }
}

/* Utils */

const logDataView = (labelOfDataSource, key, valueDataView) => {
  const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
    return b.toString(16).padStart(2, '0');
  }).join(' ');
  const textDecoder = new TextDecoder('ascii');
  const asciiString = textDecoder.decode(valueDataView.buffer);
  log(`  ${labelOfDataSource} Data: ` + key +
      '\n    (Hex) ' + hexString +
      '\n    (ASCII) ' + asciiString);
};
