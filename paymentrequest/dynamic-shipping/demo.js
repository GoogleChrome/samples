/**
 * Invokes PaymentRequest with dynamic shipping price calculation.
 */
function onBuyClicked() {
  var supportedInstruments = [{
    supportedMethods: ['amex', 'diners', 'discover', 'jcb', 'mastercard',
        'unionpay', 'visa']
  }];

  var details = {
    total: {label: 'Donation', amount: {currency: 'USD', value: '55.00'}},
    displayItems: [
      {
        label: 'Original donation amount',
        amount: {currency: 'USD', value: '65.00'}
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'}
      }
    ]
  };

  var options = {requestShipping: true};

  var request = new PaymentRequest(supportedInstruments, details, options); // eslint-disable-line no-undef

  request.addEventListener('shippingaddresschange', function(evt) {
    evt.updateWith(new Promise(function(resolve) {
      updateDetails(details, request.shippingAddress, resolve);
    }));
  });

  request.show().then(function(instrumentResponse) {
    sendPaymentToServer(instrumentResponse);
  })
  .catch(function(err) {
    ChromeSamples.setStatus(err);
  });
}

/**
 * Updates the shipping price and the total based on the shipping address.
 *
 * @private
 * @param {PaymentDetails} details The line items and shipping options.
 * @param {PaymentAddress} shippingAddress User's preferred shipping address to
 * use for shipping price calculations.
 * @param {function} callback The callback to invoke with updated line items and
 * shipping options.
 */
function updateDetails(details, shippingAddress, callback) {
  if (shippingAddress.country === 'US') {
    var shippingOption = {
      id: '',
      label: '',
      amount: {currency: 'USD', value: '0.00'},
      selected: true
    };
    if (shippingAddress.region === 'CA') {
      shippingOption.id = 'californiaFreeShipping';
      shippingOption.label = 'Free shipping in California';
      details.total.amount.value = '55.00';
    } else {
      shippingOption.id = 'unitedStatesStandardShipping';
      shippingOption.label = 'Standard shipping in US';
      shippingOption.amount.value = '5.00';
      details.total.amount.value = '60.00';
    }
    details.displayItems.splice(2, 1, shippingOption);
    details.shippingOptions = [shippingOption];
  } else {
    // Don't ship outside of US for the purposes of this example.
    delete details.shippingOptions;
  }
  callback(details);
}

/**
 * Simulates processing the payment data on the server.
 *
 * @private
 * @param {PaymentResponse} instrumentResponse The payment information to
 * process.
 */
function sendPaymentToServer(instrumentResponse) {
  // There's no server-side component of these samples. Not transactions are
  // processed and no money exchanged hands. Instantaneous transactions are not
  // realistic. Add a 2 second delay to make it seem more real.
  window.setTimeout(function() {
    instrumentResponse.complete('success')
        .then(function() {
          document.getElementById('result').innerHTML =
              instrumentToJsonString(instrumentResponse);
        })
        .catch(function(err) {
          ChromeSamples.setStatus(err);
        });
  }, 2000);
}

/**
 * Converts the payment instrument into a JSON string.
 *
 * @private
 * @param {PaymentResponse} instrument The instrument to convert.
 * @return {string} The JSON string representation of the instrument.
 */
function instrumentToJsonString(instrument) {
  var details = instrument.details;
  details.cardNumber = 'XXXX-XXXX-XXXX-' + details.cardNumber.substr(12);
  details.cardSecurityCode = '***';

  // PaymentInsrument is an interface, but JSON.stringify works only on
  // dictionaries.
  return JSON.stringify({
    methodName: instrument.methodName,
    details: details,
    shippingAddress: addressToDictionary(instrument.shippingAddress),
    shippingOption: instrument.shippingOption
  }, undefined, 2);
}

/**
 * Converts the shipping address into a dictionary.
 *
 * @private
 * @param {PaymentAddress} address The address to convert.
 * @return {object} The dictionary representation of the shipping address.
 */
function addressToDictionary(address) {
  return {
    recipient: address.recipient,
    careOf: address.careOf,
    organization: address.organization,
    addressLine: address.addressLine,
    dependentLocality: address.dependentLocality,
    city: address.city,
    region: address.region,
    postalCode: address.postalCode,
    sortingCode: address.sortingCode,
    country: address.country,
    phone: address.phone
  };
}

var buyButton = document.getElementById('buyButton');
buyButton.setAttribute('style', 'display: none;');
if (!('PaymentRequest' in window)) {
  ChromeSamples.setStatus(
      'Enable chrome://flags/#enable-experimental-web-platform-features');
} else if (!navigator.userAgent.match(/Android/i)) {
  ChromeSamples.setStatus(
      'PaymentRequest is supported only on Android for now.');
} else if (!navigator.userAgent.match(/Chrome\/5[3-4]/i)) { // eslint-disable-line no-negated-condition
  ChromeSamples.setStatus('These tests are for Chrome 53 and 54.');
} else {
  buyButton.setAttribute('style', 'display: inline;');
  buyButton.addEventListener('click', onBuyClicked);
}
