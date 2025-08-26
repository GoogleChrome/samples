'use strict';

const dayRgb = [200, 225, 255];
const nightRgb = [20, 30, 60];
let night = 0;
let targetNight = night;
let rate = 1 / 60;

function smooth(x) {
  return x < 0.5 ? 2 * x ** 2 : 1 - (2 * (1 - x) ** 2);
}

function updateColour() {
  const colour = `rgb(${dayRgb.map((day, i) => ((nightRgb[i] - day) * smooth(night) + day))})`;
  themeColor.content = colour;
  document.body.style.backgroundColor = colour;
  if (night == targetNight) {
    return;
  }
  if (Math.abs(targetNight - night) < rate) {
    night = targetNight;
  } else {
    night += rate * (targetNight < night ? -1 : 1);
  }
  requestAnimationFrame(updateColour);
}

button.onclick = _ => {
  targetNight = 1 - targetNight;
  button.textContent = targetNight ? 'Night mode' : 'Day mode';
  updateColour();
}

function main() {
  updateColour();
  navigator.serviceWorker.register('serviceworker.js');
}

main();