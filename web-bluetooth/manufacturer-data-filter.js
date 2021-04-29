function onButtonClick() {
  let manufacturerData = {};

  let filterCompanyIdentifier = document.querySelector('#companyIdentifier').value;
  if (filterCompanyIdentifier) {
    manufacturerData.companyIdentifier = parseInt(filterCompanyIdentifier);
  }
  
  let filterDataPrefix = document.querySelector('#dataPrefix').value;
  if (filterDataPrefix) {
    manufacturerData.dataPrefix = hexStringToUint8Array(filterDataPrefix);
  }

  let filterMask = document.querySelector('#mask').value;
  if (filterMask) {
    manufacturerData.mask = hexStringToUint8Array(filterMask);
  }

  let options = { filters: [{ manufacturerData: [manufacturerData] }] };

  log('Requesting Bluetooth Device...');
  log('with ' + JSON.stringify(options));
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    log('> Name:             ' + device.name);
    log('> Id:               ' + device.id);
    log('> Connected:        ' + device.gatt.connected);
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

/* Utils */

function hexStringToUint8Array(hexString) {
  if (hexString.length % 2 != 0) {
    throw "Invalid hexString";
  }
  let arrayBuffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    let byteValue = parseInt(hexString.substr(i, 2), 16);
    if (byteValue == NaN) {
      throw "Invalid hexString";
    }
    arrayBuffer[i / 2] = byteValue;
  }
  return arrayBuffer;
}
