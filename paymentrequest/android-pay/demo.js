function onBuyClicked() {
  var supportedInstruments = [
    {
      supportedMethods: ['https://android.com/pay'],
      data: {
        'gateway': 'stripe',
        // Place your own Stripe publishable key here.
        'stripe:publishableKey': 'pk_test_VKUbaXb3LHE7GdxyOBMNwXqa',
        'stripe:version': '2016-03-07'
      }
    }
  ];

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

  try {
    new PaymentRequest(supportedInstruments, details) // eslint-disable-line no-undef
        .show()
        .then(function(instrumentResponse) {
          // Simulate server-side processing with a 2 second delay.
          window.setTimeout(function() {
            instrumentResponse.complete(true)
                .then(function() {
                  document.getElementById('result').innerHTML =
                      'methodName: ' + instrumentResponse.methodName +
                      '<br>totalAmount: ' +
                      JSON.stringify(
                          instrumentResponse.totalAmount, undefined, 2) +
                      '<br>details: ' +
                      JSON.stringify(instrumentResponse.details, undefined, 2);
                })
                .catch(function(err) {
                  ChromeSamples.setStatus(err.message);
                });
          }, 2000);
        })
        .catch(function(err) {
          ChromeSamples.setStatus(err.message);
        });
  } catch (e) {
    ChromeSamples.setStatus('Developer mistake: \'' + e.message + '\'');
  }
}

var buyButton = document.getElementById('buyButton');
buyButton.setAttribute('style', 'display: none;');
if (!('PaymentRequest' in window)) {
  ChromeSamples.setStatus(
      'Enable chrome://flags/#enable-experimental-web-platform-features');
} else if (!navigator.userAgent.match(/Android/i)) {
  ChromeSamples.setStatus(
      'PaymentRequest is supported only on Android for now.');
} else if (!navigator.userAgent.match(/Chrome\/53/i)) { // eslint-disable-line no-negated-condition
  ChromeSamples.setStatus('These tests are for Chrome Dev 53.');
} else {
  buyButton.setAttribute('style', 'display: inline;');
  buyButton.addEventListener('click', onBuyClicked);
}
