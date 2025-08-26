export const isPlayBilling = !!window.getBillingClient;
const nonPlaySkus = [
  {
    title: 'Marmot Feed',
    description: 'Marmots get dangerous when not fed.',
    sku: 'MF00',
    priceCurrencyCode: 'AUD',
    priceAmountMicros: 1 * 1000000 // $1 AUD
  },
  {
    title: 'Lawyer for dangerous Marmot',
    description: 'Unfed Marmots can be dangerous, and may require a lawyer to get them out of trouble.',
    sku: 'LFDM',
    priceCurrencyCode: 'AUD',
    priceAmountMicros: 100 * 1000000 // $100 AUD
  },
  {
    title: 'Marmot Proof Clothing',
    description: 'Being around Marmot\'s need not be threatening!',
    sku: 'MPC0',
    priceCurrencyCode: 'AUD',
    priceAmountMicros: 200 * 1000000 // $200 AUD
  }
];

// A list of all sku codes, to query Play for.
const skuCodes = nonPlaySkus.map(s => s.sku);

let billingClientPromise;

/**
* Get a list of all skus. Doesn't apply any transformations.
*/
const getSkusInternal = async () => {
  if (!isPlayBilling) {
    // In the real world, we'd probably ask our server instead of doing this.
    return nonPlaySkus;
  }
  
  if (!billingClientPromise)
    billingClientPromise = window.getBillingClient();
  
  const billingClient = await billingClientPromise;
  const skuDetailsParams = {
    type: 'inapp',
    skus: skuCodes
  };
  
  const result = await billingClient.getSkuDetails(skuDetailsParams);
  
  // Some transformations may be required.
  return result.skuDetailsList;
}

/**
* Get a list of all available SKUs. Implentation is different between Play and non-play systems.
*/
export const getSkus = async () => {
  const skus = await getSkusInternal();

  // Include a SKU source.
  return skus.map(s => ({
    ...s,
    source: isPlayBilling ? 'play' : 'self'
  }));
}

/**
* Get details for a specific sku.
*/
export const getSkuDetails = async (code) => {
  const skus = await getSkus();
  return skus.filter(s => s.sku === code)[0];
}

export const purchaseSku = async (code) => {
  const sku = await getSkuDetails(code);
  
  const paymentRequest = new PaymentRequest([
    {
      supportedMethods: "https://play.google.com/billing",
      data: {
        skuDetails: sku
      }
    },
    {
      supportedMethods: "basic-card",
      data: {
        merchantId: '123'
      }
    }
  ], {
    // Only used by non-play billing methods.
    total: {
      label: sku.title,
      amount: {
        value: sku.priceAmountMicros / 1000000,
        currency: sku.priceCurrencyCode
      }
    }
  });
  
  const response = await paymentRequest.show();
  
  // I think this is only relevant for basic-card payments.
  await response.complete();
  
  const purchase = {
    sku: code,
    title: sku.title,
    date: Date.now(),
    source: sku.source
  };
  
  return purchase;
}