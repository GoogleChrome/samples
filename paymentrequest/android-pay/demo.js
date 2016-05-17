function onBuyClicked() {
  var supportedInstruments = ['https://android.com/pay'];

  var details = {
    items: [
      {
        id: 'original',
        label: 'Original donation amount',
        amount: {currencyCode: 'USD', value: '65.00'}
      },
      {
        id: 'discount',
        label: 'Friends and family discount',
        amount: {currencyCode: 'USD', value: '-10.00'}
      },
      {
        id: 'total',
        label: 'Donation',
        amount: {currencyCode: 'USD', value: '55.00'}
      }
    ]
  };

  var schemeData = {
    'https://android.com/pay': {
      'gateway': 'stripe',
       // Place your own Stripe publishable key here.
      'stripe:publishableKey': 'pk_live_lNk21zqKM2BENZENh3rzCUgo',
      'stripe:version': '2016-03-07'
    }
  };

  try {
    // eslint-disable-next-line no-undef
    new PaymentRequest(supportedInstruments, details, null, schemeData)
        .show()
        .then(function(instrumentResponse) {
          // Simulate server-side processing with a 2 second delay.
          window.setTimeout(function() {
            instrumentResponse.complete(true)
                .then(function() {
                  document.getElementById('result').innerHTML =
                      'methodName: ' + instrumentResponse.methodName +
                      '<br>details:<br>' +
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
    ChromeSamples.status('Developer mistake: \'' + e.message + '\'');
  }
}

var buyButton = document.getElementById('buyButton');
if ('PaymentRequest' in window) {
  buyButton.addEventListener('click', onBuyClicked);
} else {
  buyButton.setAttribute('style', 'display: none;');
  ChromeSamples.setStatus('PaymentRequest is not supported on this platform.');
}
