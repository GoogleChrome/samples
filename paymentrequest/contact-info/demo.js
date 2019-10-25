/**
 * Builds PaymentRequest that also gathers user's contact information, but does
 * not show any UI yet.
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
    ],
  };

  let options = {
    requestPayerName: true,
    requestPayerPhone: true,
    requestPayerEmail: true,
  };

  return new PaymentRequest(supportedInstruments, details, options);
}

/**
 * Invokes PaymentRequest that also gathers user's contact information.
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
    payerName: instrument.payerName,
    payerPhone: instrument.payerPhone,
    payerEmail: instrument.payerEmail,
  }, undefined, 2);
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
