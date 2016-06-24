function onBuyClicked() {
  var supportedInstruments = [{
    supportedMethods: [
      'amex', 'diners', 'discover', 'jcb', 'maestro', 'mastercard', 'unionpay',
      'visa'
    ]
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
      },
      {
        label: 'Standard shipping',
        amount: {currency: 'USD', value: '0.00'}
      }
    ],
    shippingOptions: [
      {
        id: 'standard',
        label: 'Standard shipping',
        amount: {currency: 'USD', value: '0.00'},
        selected: true
      },
      {
        id: 'express',
        label: 'Express shipping',
        amount: {currency: 'USD', value: '12.00'}
      }
    ]
  };

  var options = {requestShipping: true};

  try {
    var request = new PaymentRequest(supportedInstruments, details, options); // eslint-disable-line no-undef

    request.addEventListener('shippingoptionchange', function(evt) {
      evt.updateWith(new Promise(function(resolve, reject) {
        updateDetails(details, request.shippingOption, resolve, reject);
      }));
    });

    request.show().then(function(instrumentResponse) {
      // Simulate server-side processing with a 2 second delay.
      window.setTimeout(function() {
        instrumentResponse.complete('success')
            .then(function() {
              document.getElementById('result').innerHTML =
                  'shippingOption: ' + request.shippingOption +
                  '<br>shippingAddress: ' +
                  JSON.stringify(
                      toDictionary(instrumentResponse.shippingAddress),
                      undefined, 2) +
                  '<br>methodName: ' + instrumentResponse.methodName +
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

function updateDetails(details, shippingOption, resolve, reject) {
  var selectedShippingOption;
  var otherShippingOption;
  if (shippingOption === 'standard') {
    selectedShippingOption = details.shippingOptions[0];
    otherShippingOption = details.shippingOptions[1];
    details.total.amount.value = '55.00';
  } else if (shippingOption === 'express') {
    selectedShippingOption = details.shippingOptions[1];
    otherShippingOption = details.shippingOptions[0];
    details.total.amount.value = '67.00';
  } else {
    reject('Unknown shipping option \'' + shippingOption + '\'');
    return;
  }
  selectedShippingOption.selected = true;
  otherShippingOption.selected = false;
  details.displayItems.splice(2, 1, selectedShippingOption);
  resolve(details);
}

function toDictionary(addr) {
  var dict = {};
  if (addr) {
    dict.country = addr.country;
    dict.region = addr.region;
    dict.city = addr.city;
    dict.dependentLocality = addr.dependentLocality;
    dict.addressLine = addr.addressLine;
    dict.postalCode = addr.postalCode;
    dict.sortingCode = addr.sortingCode;
    dict.languageCode = addr.languageCode;
    dict.organization = addr.organization;
    dict.recipient = addr.recipient;
    dict.careOf = addr.careOf;
    dict.phone = addr.phone;
  }
  return dict;
}
