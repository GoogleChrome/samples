/**
 * Invokes PaymentRequest that also gathers user's contact information.
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

  var options = {requestPayerPhone: true, requestPayerEmail: true};

  new PaymentRequest(supportedInstruments, details, options) // eslint-disable-line no-undef
      .show()
      .then(function(instrumentResponse) {
        sendPaymentToServer(instrumentResponse);
      })
      .catch(function(err) {
        ChromeSamples.setStatus(err);
      });
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
    payerPhone: instrument.payerPhone,
    payerEmail: instrument.payerEmail
  }, undefined, 2);
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
