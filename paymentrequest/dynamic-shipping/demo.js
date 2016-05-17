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

  var options = {requestShipping: true};

  try {
    var request = new PaymentRequest(supportedInstruments, details, options); // eslint-disable-line no-undef

    request.addEventListener('shippingaddresschange', function(evt) {
      evt.updateWith(new Promise(function(resolve, reject) {
        updateDetails(details, request.shippingAddress, resolve, reject);
      }));
    });

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

function updateDetails(details, shippingAddress, resolve, reject) {
  if (shippingAddress.regionCode === 'US') {
    var shippingOption = {
      id: '',
      label: '',
      amount: {currencyCode: 'USD', value: '0.00'}
    };
    if (shippingAddress.administrativeArea === 'CA') {
      shippingOption.id = 'ca';
      shippingOption.label = 'Free shipping in California';
      details.items[details.items.length - 1].amount.value = '55.00';
    } else {
      shippingOption.id = 'us';
      shippingOption.label = 'Standard shipping in US';
      shippingOption.amount.value = '5.00';
      details.items[details.items.length - 1].amount.value = '60.00';
    }
    if (details.items.length === 3) {
      details.items.splice(-1, 0, shippingOption);
    } else if (details.items.length === 4) {
      details.items.splice(-2, 1, shippingOption);
    } else {
      reject('There should ever be only 3 or 4 line items. ' +
             'Don\'t know how to handle ' + details.items.length.toString());
      return;
    }
    details.shippingOptions = [shippingOption];
  } else {
    delete details.shippingOptions;
  }
  resolve(details);
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
