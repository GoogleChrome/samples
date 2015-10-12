function uiEventHandler(event) {
  if (event.type === 'mousedown' && event.sourceCapabilities.firesTouchEvents) {
    // If this is a "fake" mousedown event synthesized when tapping on a touchscreen, ignore it.
    return;
  }

  var status = 'The device that triggered this ' + event.type + ' event ' +
    (event.sourceCapabilities.firesTouchEvents ? 'does' : 'does not') +
    ' fire touch events.';
  ChromeSamples.setStatus(status);

  // At this point, you might do something like set a "pressed" style on the button, etc.
}

var button = document.querySelector('#press-me');
button.addEventListener('mousedown', uiEventHandler);
button.addEventListener('touchstart', uiEventHandler);
