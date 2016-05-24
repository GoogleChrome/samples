window.addEventListener('keydown', function(event) {
  if ('key' in event) {
    ChromeSamples.log('KeyboardEvent.key:', event.key);
  } else {
    ChromeSamples.setStatus('KeyboardEvent.key is not supported.');
  }
});
