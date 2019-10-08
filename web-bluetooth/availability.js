navigator.bluetooth.getAvailability()
.then(isBluetoothAvailable => {
  log(`> Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`);
});

if ('onavailabilitychanged' in navigator.bluetooth) {
  navigator.bluetooth.addEventListener('availabilitychanged', function(event) {
    log(`> Bluetooth is ${event.value ? 'available' : 'unavailable'}`);
  });
}