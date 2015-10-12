// A subset of keys from https://w3c.github.io/uievents/#keys-modifiers
var modifierKeys = ['Alt', 'Control', 'Meta', 'Shift', 'AltGraph'];

document.querySelector('#output').addEventListener('mousemove', function(event) {
  modifierKeys.forEach(function(modifierKey) {
    var pressed = event.getModifierState(modifierKey);
    document.getElementById(modifierKey).style.fontWeight = pressed ? 'bold' : 'normal';
  });
});
