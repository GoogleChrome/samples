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
    ],
    shippingOptions: [
      {
        id: 'standard',
        label: 'Standard shipping',
        amount: {currencyCode: 'USD', value: '0.00'}
      },
      {
        id: 'express',
        label: 'Express shipping',
        amount: {currencyCode: 'USD', value: '12.00'}
      }
    ]
  };

  var options = {requestShipping: true};

  try {
    // eslint-disable-next-line no-undef
    var request = new PaymentRequest(supportedInstruments, details, options);

    request.addEventListener('shippingoptionchange', function(evt) {
      evt.updateWith(new Promise(function(resolve, reject) {
        updateDetails(details, request.shippingOption, resolve, reject);
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

function updateDetails(details, shippingOption, resolve, reject) {
  var selectedShippingOption;
  if (shippingOption === 'standard') {
    selectedShippingOption = details.shippingOptions[0];
    details.items[details.items.length - 1].amount.value = '55.00';
  } else if (shippingOption === 'express') {
    selectedShippingOption = details.shippingOptions[1];
    details.items[details.items.length - 1].amount.value = '67.00';
  } else {
    reject('Unknown shipping option \'' + shippingOption + '\'');
    return;
  }
  if (details.items.length === 3) {
    details.items.splice(-1, 0, selectedShippingOption);
  } else if (details.items.length === 4) {
    details.items.splice(-2, 1, selectedShippingOption);
  } else {
    reject('There should ever be only 3 or 4 line items. ' +
           'Don\'t know how to handle ' + details.items.length.toString());
    return;
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
