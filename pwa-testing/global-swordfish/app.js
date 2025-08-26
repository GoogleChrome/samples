import { getSkus, purchaseSku } from './sku-manager.js'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}

async function initialize() {
  const container = document.getElementById('sku-details-container');
  
  const skus = await getSkus();
  for (const sku of skus) {
    const element = document.createElement('sku-details');
    element.setAttribute('sku', sku.sku);
    
    container.appendChild(element);
  }
}

initialize();