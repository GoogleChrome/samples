/**
 * Builds PaymentRequest with multiple shipping options, but does not show any
 * UI yet.
 *
 * @return {PaymentRequest} The PaymentRequest object.
 */
function initPaymentRequest() {
  let networks = ['amex', 'diners', 'discover', 'jcb', 'mastercard', 'unionpay',
      'visa', 'mir'];
  let types = ['debit', 'credit', 'prepaid'];
  let supportedInstruments = [{
    supportedMethods: 'basic-card',
    data: {supportedNetworks: networks, supportedTypes: types},
  }];

  let details = {
    total: {label: 'Donation', amount: {currency: 'USD', value: '55.00'}},
    displayItems: [
      {
        label: 'Original donation amount',
        amount: {currency: 'USD', value: '65.00'},
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'},
      },
      {
        label: 'Standard shipping',
        amount: {currency: 'USD', value: '0.00'},
      },
    ],
    shippingOptions: [
      {
        id: 'standard',
        label: 'Standard shipping',
        amount: {currency: 'USD', value: '0.00'},
        selected: true,
      },
      {
        id: 'express',
        label: 'Express shipping',
        amount: {currency: 'USD', value: '12.00'},
      },
    ],
  };

  let options = {requestShipping: true};

  let request = new PaymentRequest(supportedInstruments, details, options);

  request.addEventListener('shippingaddresschange', function(evt) {
    evt.updateWith(Promise.resolve(details));
  });

  request.addEventListener('shippingoptionchange', function(evt) {
    evt.updateWith(new Promise(function(resolve, reject) {
      updateDetails(details, request.shippingOption, resolve, reject);
    }));
  });

  return request;
}

/**
 * Invokes PaymentRequest with multiple shipping options.
 *
 * @param {PaymentRequest} request The PaymentRequest object.
 */
function onBuyClicked(request) {
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
 * @param {string} shippingOption User's preferred shipping option to use for
 * shipping price calculations.
 * @param {function} resolve The callback to invoke with updated line items and
 * shipping options.
 * @param {function} reject The callback to invoke in case of failure.
 */
function updateDetails(details, shippingOption, resolve, reject) {
  if (shippingOption === 'standard') {
    selectedShippingOption = details.shippingOptions[0];
    otherShippingOption = details.shippingOptions[1];
    details.total.amount.value = '55.00';
  } else if (shippingOption === 'express') {
    selectedShippingOption = details.shippingOptions[1];
    otherShippingOption = details.shippingOptions[0];
    details.total.amount.value = '67.00';
  } else {
    reject('Unknown shipping option \'' + shippingOption + '\'');
    return;
  }
  selectedShippingOption.selected = true;
  otherShippingOption.selected = false;
  details.displayItems.splice(2, 1, selectedShippingOption);
  resolve(details);
}

/**
 * Simulates processing the payment data on the server.
 *
 * @private
 * @param {PaymentResponse} instrumentResponse The payment information to
 * process.
 */
function sendPaymentToServer(instrumentResponse) {
  // There's no server-side component of these samples. No transactions are
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
  details = instrument.details;
  details.cardNumber = 'XXXX-XXXX-XXXX-' + details.cardNumber.substr(12);
  details.cardSecurityCode = '***';

  return JSON.stringify({
    methodName: instrument.methodName,
    details: details,
    shippingAddress: addressToDictionary(instrument.shippingAddress),
    shippingOption: instrument.shippingOption,
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
  if (address.toJSON) {
    return address.toJSON();
  }

  return {
    recipient: address.recipient,
    organization: address.organization,
    addressLine: address.addressLine,
    dependentLocality: address.dependentLocality,
    city: address.city,
    region: address.region,
    postalCode: address.postalCode,
    sortingCode: address.sortingCode,
    country: address.country,
    languageCode: address.languageCode,
    phone: address.phone,
  };
}

const payButton = document.getElementById('buyButton');
payButton.setAttribute('style', 'display: none;');
if (window.PaymentRequest) {
  let request = initPaymentRequest();
  payButton.setAttribute('style', 'display: inline;');
  payButton.addEventListener('click', function() {
    onBuyClicked(request);
    request = initPaymentRequest();
  });
} else {
  ChromeSamples.setStatus('This browser does not support web payments');
}
