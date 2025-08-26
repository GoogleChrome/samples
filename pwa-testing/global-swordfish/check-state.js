import { isPlayBilling } from './sku-manager.js';

const modeSpan = document.getElementById('mode-span');
modeSpan.innerText = isPlayBilling ? "Play" : "Web";