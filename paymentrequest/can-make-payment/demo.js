/**
 * The callback for successful creation of PaymentRequest.
 *
 * @callback successCallback
 * @param {PaymentRequest} request The newly created instance of PaymentRequest
 * object.
 * @param {string} optionalWarning The optional warning message to be used, for
 * example, when unable to determine whether the browser can make payments.
 */

/**
 * The callback for failed creation of PaymentRequest.
 *
 * @callback failureCallback
 * @param {string} error The message indicating the reason why an instance of
 * PaymentRequest was not created.
 */

/**
 * Asynchronously builds PaymentRequest for both Android Pay and credit card
 * payments, but does not show any UI yet. Succeeds only if can make payments.
 * If you encounter issues when running your own copy of this sample, run 'adb
 * logcat | grep Wallet' to see detailed error messages.
 *
 * @param {successCallback} onSuccess The callback to invoke when this function
 * is finished successfully.
 * @param {failureCallback} onFailure The callback to invoke when this function
 * is finished with failure.
 */
function initPaymentRequest(onSuccess, onFailure) {
  if (!window.PaymentRequest) {
    onFailure('This browser does not support web payments.');
    return;
  }

  let networks = ['amex', 'diners', 'discover', 'jcb', 'mastercard', 'unionpay',
      'visa', 'mir'];
  let types = ['debit', 'credit', 'prepaid'];
  let supportedInstruments = [{
    supportedMethods: 'https://android.com/pay',
    data: {
      merchantName: 'Android Pay Demo',
      // Place your own Android Pay merchant ID here. The merchant ID is tied to
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
  }, {
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

  let request = new PaymentRequest(supportedInstruments, details);

  if (request.canMakePayment) {
    request.canMakePayment().then(function(result) {
      if (result) {
        onSuccess(request);
      } else {
        onFailure('Cannot make payment');
      }
    }).catch(function(err) {
      onSuccess(request, err);
    });
  } else {
    onSuccess(
        request, 'This browser does not support "can make payment" query');
  }
}

/**
 * Invokes PaymentRequest for Android Pay.
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

/**
 * Initializes the buy button.
 *
 * @param {HTMLElement} payButton The "Buy" button to initialize.
 */
function initBuyButton(payButton) {
  initPaymentRequest(function(request, optionalWarning) {
    payButton.setAttribute('style', 'display: inline;');
    ChromeSamples.setStatus(optionalWarning ? optionalWarning : '');
    payButton.addEventListener('click', function handleClick() {
      payButton.removeEventListener('click', handleClick);
      onBuyClicked(request);
      initBuyButton(payButton);
    });
  }, function(error) {
    payButton.setAttribute('style', 'display: none;');
    ChromeSamples.setStatus(error);
  });
}

const payButton = document.getElementById('buyButton');
payButton.setAttribute('style', 'display: none;');
ChromeSamples.setStatus('Checking...');
initBuyButton(payButton);
