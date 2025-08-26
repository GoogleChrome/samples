import { getSkuDetails, purchaseSku } from './sku-manager.js'
import { recordPurchase } from './sku-purchase-history.js'

const styles = `
.purchase-sku {
  margin-top: 5px;
}

.sku-details {
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.75);
}`;

class SkuDetails extends HTMLElement {
  static get observedAttributes() {
    return [ "sku" ]
  }
    
  constructor() {
    super();
          
    const shadow = this.attachShadow({mode: 'open'});
    this.root = document.createElement('div');
    this.root.innerHTML = this.getHtml();

    // Append it to the shadow root
    shadow.appendChild(this.root);
    
    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);
    
    this.update();    
  }
  
  get sku() {
    return this.getAttribute('sku');
  }
  
  set sku(value) {
    this.setAttribute('sku', value);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'sku')
      return;
    
    this.update();
  }
  
  async update() {
    const sku = await getSkuDetails(this.sku);
    this.root.innerHTML = this.getHtml(sku);
    
    // Bind the click handler.
    this.root.querySelector('.purchase-sku').addEventListener('click', async () => {
      const purchase = await purchaseSku(this.sku);
      recordPurchase(purchase);
    });
  }
  
  getHtml(forSku) {
    const loading = !!forSku;
    return `<div class="sku-details">
      ${loading ? Object.keys(forSku).map(key => `<div>
        ${key}: <span class="sku-value">${forSku[key]}</span>
      </div>`).join('\n') : 'Loading...'}
      <button class="purchase-sku">Buy</button>
    </div>`
  }
}

customElements.define('sku-details', SkuDetails);