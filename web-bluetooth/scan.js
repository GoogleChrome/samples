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
      log("Advertisement received.");
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
