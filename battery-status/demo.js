var chargingStateEl = document.getElementById('chargingState');
var chargingTimeEl = document.getElementById('chargingTime');
var dichargeTimeEl = document.getElementById('dischargeTime');
var levelEl = document.getElementById('level');

function updateBatteryUI(battery) {
  battery = battery || this;

  levelEl.textContent = (battery.level * 100) + '%';
  chargingTimeEl.textContent = battery.chargingTime + ' Seconds';
  dichargeTimeEl.textContent = battery.dischargingTime + ' Seconds';

  if(battery.charging === true) {
    chargingStateEl.textContent = 'Charging';
  } else if(battery.charging === false) {
    chargingStateEl.textContent = 'Discharging';
  }
}

function monitorBattery(battery) {
  // Update the initial UI.
  updateBatteryUI(battery);

  // Monitor for futher updates.
  battery.addEventListener('levelchange', updateBatteryUI);
  battery.addEventListener('chargingchange', updateBatteryUI);
  battery.addEventListener('dischargingtimechange', updateBatteryUI);
  battery.addEventListener('chargingtimechange', updateBatteryUI);
}

if('getBattery' in navigator) {
  navigator.getBattery().then(monitorBattery);
} else {
  ChromeSamples.setStatus('The Battery Status API is not supported on this platform.');
}
