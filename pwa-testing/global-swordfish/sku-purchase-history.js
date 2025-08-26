const styles = `
th, td {
  text-align: left;
}

th {
  border-bottom: 2px solid black;
}

td:before, th:before {
  content: '|';
  margin-right: 10px;
}
`;

let updater;
const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
window.purchases = purchases;

export const recordPurchase = (purchase) => {
  purchases.push(purchase);
  localStorage.setItem('purchases', JSON.stringify(purchases));
  
  updater && updater();
}

class SkuPurchaseHistory extends HTMLElement {
  static get observedAttributes() {
    return [ ]
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
    updater = this.update.bind(this);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {    
    this.update();
  }
  
  async update() {
    this.root.innerHTML = this.getHtml();
  }
  
  getHtml() {
    return `<table class="sku-purchase-history">
     <thead>
       <tr>
         <th>Date</th>
         <th>SKU</th>
         <th>Title</th>
         <th>Source</th>
       </tr>
     </thead>
     <tbody>
       ${purchases.map(purchase => `<tr>
          <td>${new Date(purchase.date).toISOString()}</td>
          <td>${purchase.sku}</td>
          <td>${purchase.title}</td>
          <td>${purchase.source}</td>
        </tr>`).join('\n')}
      </tbody>
    </table>`
  }
}

customElements.define('sku-purchase-history', SkuPurchaseHistory);