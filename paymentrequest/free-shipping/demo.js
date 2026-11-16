/**
 * Builds PaymentRequest that also gathers user's shipping address, but does not
 * show any UI yet.
 *
 * @return {PaymentRequest} The PaymentRequest object.
 */
function initPaymentRequest() {
  const supportedInstruments = [{
    supportedMethods: 'https://bobbucks.dev/pay',
  }];

  const details = {
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
      {
        label: 'Free shipping worldwide',
        amount: {currency: 'USD', value: '0.00'},
      },
    ],
    shippingOptions: [{
      id: 'freeWorldwideShipping',
      label: 'Free shipping worldwide',
      amount: {currency: 'USD', value: '0.00'},
      selected: true,
    }],
  };

  const options = {requestShipping: true};

  const request = new PaymentRequest(supportedInstruments, details, options);

  request.addEventListener('shippingaddresschange', evt => {
    evt.updateWith(Promise.resolve(details));
  });

  return request;
}

/**
 * Invokes PaymentRequest that also gathers user's shipping address.
 */
async function onBuyClicked() {
  try {
    const request = initPaymentRequest();
    const instrumentResponse = await request.show();
    await sendPaymentToServer(instrumentResponse);
  } catch (err) {
    ChromeSamples.setStatus(err);
  }
}

/**
 * Simulates processing the payment data on the server.
 *
 * @private
 * @param {PaymentResponse} instrumentResponse The payment information to
 * process.
 */
async function sendPaymentToServer(instrumentResponse) {
  // There's no server-side component of these samples. No transactions are
  // processed and no money exchanged hands. Instantaneous transactions are not
  // realistic. Add a 2 second delay to make it seem more real.
  await new Promise(resolve => window.setTimeout(resolve, 2000));
  await instrumentResponse.complete('success');
  document.getElementById('result').textContent =
      JSON.stringify(instrumentResponse, undefined, 2);
}

const payButton = document.getElementById('buyButton');
payButton.setAttribute('style', 'display: none;');
if (window.PaymentRequest) {
  initPaymentRequest().canMakePayment().then(result => {
    if (result) {
      payButton.setAttribute('style', 'display: inline;');
      payButton.addEventListener('click', onBuyClicked);
    } else {
      ChromeSamples.setStatus('Cannot make payment');
    }
  }).catch(err => {
    ChromeSamples.setStatus(err);
  });
} else {
  ChromeSamples.setStatus('This browser does not support web payments');
}
