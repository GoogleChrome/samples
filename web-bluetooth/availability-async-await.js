(async () => {
  try {
    const isBluetoothAvailable = await navigator.bluetooth.getAvailability();
    log(`> Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`);
  } catch(error) {
    log('Argh! ' + error);
  }
})();

if ('onavailabilitychanged' in navigator.bluetooth) {
  navigator.bluetooth.addEventListener('availabilitychanged', function(event) {
    log(`> Bluetooth is ${event.value ? 'available' : 'unavailable'}`);
  });
}