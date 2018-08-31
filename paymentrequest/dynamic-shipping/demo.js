/**
 * Builds PaymentRequest with dynamic shipping price calculation, but does not
 * show any UI yet.
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
        label: 'Shipping',
        amount: {currency: 'USD', value: '0.00'},
        pending: true,
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'},
      },
    ],
  };

  let options = {requestShipping: true};

  let request = new PaymentRequest(supportedInstruments, details, options);

  request.addEventListener('shippingaddresschange', function(evt) {
    evt.updateWith(new Promise(function(resolve) {
      updateDetails(details, request.shippingAddress, resolve);
    }));
  });

  return request;
}

/**
 * Invokes PaymentRequest with dynamic shipping price calculation.
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
 * @param {PaymentAddress} shippingAddress User's preferred shipping address to
 * use for shipping price calculations.
 * @param {function} callback The callback to invoke with updated line items and
 * shipping options.
 */
function updateDetails(details, shippingAddress, callback) {
  let shippingOption = {
    id: '',
    label: '',
    amount: {currency: 'USD', value: '0.00'},
    selected: true,
    pending: false,
  };
  if (shippingAddress.country === 'US') {
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
    details.shippingOptions = [shippingOption];
    delete details.error;
  } else {
    // Don't ship outside of US for the purposes of this example.
    shippingOption.label = 'Shipping';
    shippingOption.pending = true;
    details.total.amount.value = '55.00';
    details.error = 'Cannot ship outside of US.';
    delete details.shippingOptions;
  }
  details.displayItems.splice(1, 1, shippingOption);
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
  let details = instrument.details;
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
