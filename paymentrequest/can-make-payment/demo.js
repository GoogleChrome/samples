/**
 * Builds PaymentRequest for both Google Pay and BobBucks, but does not show any
 * UI yet.
 * If you encounter issues when running your own copy of this sample, run 'adb
 * logcat | grep Wallet' to see detailed error messages.
 *
 * @return {PaymentRequest} The PaymentRequest object.
 */
function createPaymentRequest() {
  const supportedInstruments = [{
    supportedMethods: 'https://google.com/pay',
    data: {
      environment: 'TEST',
      apiVersion: 2,
      apiVersionMinor: 0,
      merchantInfo: {
        // A merchant ID is available after approval by Google.
        // 'merchantId': '12345678901234567890',
        merchantName: 'Example Merchant',
      },
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          // Check with your payment gateway on the parameters to pass.
          // @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway}
          parameters: {
            'gateway': 'example',
            'gatewayMerchantId': 'exampleGatewayMerchantId',
          },
        },
      }],
    },
  }, {
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
    ],
  };

  return new PaymentRequest(supportedInstruments, details);
}

/**
 * Invokes PaymentRequest and handles the response.
 */
async function onBuyClicked() {
  try {
    const request = createPaymentRequest();
    const instrumentResponse = await request.show();
    await sendPaymentToServer(instrumentResponse);
  } catch (err) {
    ChromeSamples.setStatus(err);
  }
}

/**
 * Simulates processing the payment data on the server.
 *
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

/**
 * Checks whether the browser can make a payment and initializes the buy button.
 *
 * @param {HTMLElement} payButton The "Buy" button to initialize.
 */
async function initBuyButton(payButton) {
  if (!window.PaymentRequest) {
    payButton.setAttribute('style', 'display: none;');
    ChromeSamples.setStatus('This browser does not support web payments.');
    return;
  }

  try {
    const canMakePayment = await createPaymentRequest().canMakePayment();
    if (canMakePayment) {
      payButton.setAttribute('style', 'display: inline;');
      ChromeSamples.setStatus('');
      payButton.addEventListener('click', onBuyClicked);
    } else {
      payButton.setAttribute('style', 'display: none;');
      ChromeSamples.setStatus('Cannot make payment');
    }
  } catch (err) {
    payButton.setAttribute('style', 'display: inline;');
    ChromeSamples.setStatus(err);
    payButton.addEventListener('click', onBuyClicked);
  }
}

const payButton = document.getElementById('buyButton');
payButton.setAttribute('style', 'display: none;');
ChromeSamples.setStatus('Checking...');
initBuyButton(payButton);
