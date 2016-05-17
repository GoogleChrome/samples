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
        id: 'shipping',
        label: 'Free shipping worldwide',
        amount: {currencyCode: 'USD', value: '0.00'}
      },
      {
        id: 'total',
        label: 'Donation',
        amount: {currencyCode: 'USD', value: '55.00'}
      }
    ],
    shippingOptions: [
      {
        id: 'freeWorldwideShipping',
        label: 'Free shipping worldwide',
        amount: {currencyCode: 'USD', value: '0.00'}
      }
    ]
  };

  var options = {requestShipping: true};

  try {
    var request = new PaymentRequest(supportedInstruments, details, options); // eslint-disable-line no-undef
    request.show().then(function(instrumentResponse) {
      // Simulate server-side processing with a 2 second delay.
      window.setTimeout(function() {
        instrumentResponse.complete(true)
            .then(function() {
              document.getElementById('result').innerHTML =
                  'shippingOption: ' + request.shippingOption +
                  '<br>shippingAddress:<br>' +
                  JSON.stringify(toDictionary(request.shippingAddress),
                                 undefined, 2) +
                  '<br>methodName: ' + instrumentResponse.methodName +
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

function toDictionary(addr) {
  var dict = {};
  if (addr) {
    dict.regionCode = addr.regionCode;
    dict.administrativeArea = addr.administrativeArea;
    dict.locality = addr.locality;
    dict.dependentLocality = addr.dependentLocality;
    dict.addressLine = addr.addressLine;
    dict.postalCode = addr.postalCode;
    dict.sortingCode = addr.sortingCode;
    dict.languageCode = addr.languageCode;
    dict.organization = addr.organization;
    dict.recipient = addr.recipient;
  }
  return dict;
}
