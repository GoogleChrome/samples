/**
 * Builds PaymentRequest for Google Pay, but does not show any UI yet. If you
 * encounter issues when running your own copy of this sample, run 'adb logcat |
 * grep Wallet' to see detailed error messages or watch Chrome DevTools console.
 *
 * @return {PaymentRequest} The PaymentRequest object.
 */
function initPaymentRequest() {
  let supportedInstruments = [{
    supportedMethods: 'https://google.com/pay',
    data: {
      merchantName: 'Google Pay Demo',
      // Place your own Google Pay merchant ID here. The merchant ID is tied to
      // the origin of the website.
      merchantId: '00184145120947117657',
      // If you do not yet have a merchant ID, uncomment the following line.
      // environment: 'TEST',
      allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
      paymentMethodTokenizationParameters: {
        tokenizationType: 'GATEWAY_TOKEN',
        parameters: {
          'gateway': 'stripe',
          // Place your own Stripe publishable key here. Use a matching Stripe
          // secret key on the server to initiate a transaction.
          'stripe:publishableKey': 'pk_live_lNk21zqKM2BENZENh3rzCUgo',
          'stripe:version': '2016-07-06',
        },
      },
    },
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

  return new PaymentRequest(supportedInstruments, details);
}

/**
 * Invokes PaymentRequest for Google Pay.
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
 * @param {PaymentResponse} instrument The instrument to convert.
 * @return {string} The JSON string representation of the instrument.
 */
function instrumentToJsonString(instrument) {
  if (instrument.toJSON) {
    return JSON.stringify(instrument, undefined, 2);
  } else {
    return JSON.stringify({
      methodName: instrument.methodName,
      details: instrument.details,
    }, undefined, 2);
  }
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
