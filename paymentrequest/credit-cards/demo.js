function onBuyClicked() {
  var supportedInstruments = [
    'visa',
    'mastercard',
    'amex',
    'discover',
    'maestro',
    'diners',
    'jcb',
    'unionpay'
  ];

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

  try {
    // eslint-disable-next-line no-undef
    new PaymentRequest(supportedInstruments, details)
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
