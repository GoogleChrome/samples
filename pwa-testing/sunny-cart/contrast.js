'use strict';

// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef

window.onload = () => {
  const lighter = document.getElementById('lighter');
  const lighterLuminance = document.getElementById('lighter_luminance');
  const darker = document.getElementById('darker');
  const darkerLuminance = document.getElementById('darker_luminance');
  const ratio = document.getElementById('ratio');

  
  function componentLuminance(hex) {
    let component = parseInt(hex, 16) / 255;
    if (component < 0.03928)
      return component / 12.92;
    return Math.pow(((component + 0.055) / 1.055), 2.4);
  }

  function luminance(color) {
    const R = componentLuminance(color.substring(1, 3));
    const G = componentLuminance(color.substring(3, 5));
    const B = componentLuminance(color.substring(5, 7));
    const result = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    console.log(result);
    return result;
  }

  function updateRatio() {
    const L1 = luminance(lighter.value);
    const L2 = luminance(darker.value);
    lighterLuminance.textContent = Math.floor(L1 * 1000) / 1000;
    darkerLuminance.textContent = Math.floor(L2 * 1000) / 1000;
    let result = (L1 + 0.05) / (L2 + 0.05);
    if (result < 1)
      result = 1 / result;
    ratio.textContent = Math.floor(result * 100) / 100;
  }
  
  lighter.oninput = updateRatio;
  darker.oninput = updateRatio;
  updateRatio();
}
