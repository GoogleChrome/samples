var chargingStateEl = document.getElementById('chargingState');
var chargingTimeEl = document.getElementById('chargingTime');
var dichargeTimeEl = document.getElementById('dischargeTime');
var levelEl = document.getElementById('level');

function updateBatteryUI(battery) {
  levelEl.textContent = (battery.level * 100) + '%';
  chargingTimeEl.textContent = battery.chargingTime + ' Seconds';
  dichargeTimeEl.textContent = battery.dischargingTime + ' Seconds';

  if (battery.charging === true) {
    chargingStateEl.textContent = 'Charging';
  } else if (battery.charging === false) {
    chargingStateEl.textContent = 'Discharging';
  }
}

function monitorBattery(battery) {
  // Update the initial UI.
  updateBatteryUI(battery);

  // Monitor for futher updates.
  battery.addEventListener('levelchange',
    updateBatteryUI.bind(null, battery));
  battery.addEventListener('chargingchange',
    updateBatteryUI.bind(null, battery));
  battery.addEventListener('dischargingtimechange',
    updateBatteryUI.bind(null, battery));
  battery.addEventListener('chargingtimechange',
    updateBatteryUI.bind(null, battery));
}

if ('getBattery' in navigator) {
  navigator.getBattery().then(monitorBattery);
} else {
  ChromeSamples.setStatus('The Battery Status API is not supported on ' +
    'this platform.');
}
