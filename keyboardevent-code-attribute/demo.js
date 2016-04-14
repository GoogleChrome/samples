window.addEventListener('keydown', function(event) {
  if ('code' in event) {
    ChromeSamples.log('KeyboardEvent.code:', event.code);
  } else {
    ChromeSamples.setStatus('KeyboardEvent.code is not supported.');
  }
});
