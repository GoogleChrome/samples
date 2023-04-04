async function onButtonClick() {
  let filters = populateFiltersById('filters');
  let exclusionFilters = populateFiltersById('exclusionFilters');
  let options = { filters, exclusionFilters };

  try {
    log('Requesting Bluetooth Device...');
    log('with ' + JSON.stringify(options));
    const device = await navigator.bluetooth.requestDevice(options);

    log('> Name:             ' + device.name);
    log('> Id:               ' + device.id);
    log('> Connected:        ' + device.gatt.connected);
  } catch(error)  {
    log('Argh! ' + error);
  }
}

/* Utils */

function populateFiltersById(id) {
  let filters = [];
  
  let filterService = document.querySelector(`#${id} .service`).value;
  if (filterService.startsWith('0x')) {
    filterService = parseInt(filterService);
  }
  if (filterService) {
    filters.push({services: [filterService]});
  }

  let filterName = document.querySelector(`#${id} .name`).value;
  if (filterName) {
    filters.push({name: filterName});
  }

  let filterNamePrefix = document.querySelector(`#${id} .namePrefix`).value;
  if (filterNamePrefix) {
    filters.push({namePrefix: filterNamePrefix});
  }

  return filters;
}
