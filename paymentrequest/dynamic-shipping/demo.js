/**
 * Builds PaymentRequest with dynamic shipping price calculation, but does not
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
        label: 'Shipping',
        amount: {currency: 'USD', value: '0.00'},
        pending: true,
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'},
      },
    ],
  };

  const options = {requestShipping: true};

  const request = new PaymentRequest(supportedInstruments, details, options);

  request.addEventListener('shippingaddresschange', evt => {
    evt.updateWith(updateDetails(details, request.shippingAddress));
  });

  return request;
}

/**
 * Invokes PaymentRequest with dynamic shipping price calculation.
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
 * Updates the shipping price and the total based on the shipping address.
 *
 * @private
 * @param {PaymentDetails} details The line items and shipping options.
 * @param {PaymentAddress} shippingAddress User's preferred shipping address to
 * use for shipping price calculations.
 * @return {Promise<PaymentDetails>} The updated payment details.
 */
async function updateDetails(details, shippingAddress) {
  const shippingOption = {
    id: '',
    label: '',
    amount: {currency: 'USD', value: '0.00'},
    selected: true,
    pending: false,
  };
  if (shippingAddress.country === 'US') {
    if (shippingAddress.region === 'CA') {
      shippingOption.id = 'californiaFreeShipping';
      shippingOption.label = 'Free shipping in California';
      details.total.amount.value = '55.00';
    } else {
      shippingOption.id = 'unitedStatesStandardShipping';
      shippingOption.label = 'Standard shipping in US';
      shippingOption.amount.value = '5.00';
      details.total.amount.value = '60.00';
    }
    details.shippingOptions = [shippingOption];
    delete details.error;
  } else {
    // Don't ship outside of US for the purposes of this example.
    shippingOption.label = 'Shipping';
    shippingOption.pending = true;
    details.total.amount.value = '55.00';
    details.error = 'Cannot ship outside of US.';
    delete details.shippingOptions;
  }
  details.displayItems.splice(1, 1, shippingOption);
  return details;
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
