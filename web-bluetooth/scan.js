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
    log('Requesting Bluetooth Scan...');
    log('with ' + JSON.stringify(options));
    await navigator.bluetooth.requestLEScan(options);

    log('Scan started...');

    navigator.bluetooth.addEventListener('advertisementreceived', event => {
      log("Advertisement received.");
    });
  } catch(error)  {
    log('Argh! ' + error);
  }
}
