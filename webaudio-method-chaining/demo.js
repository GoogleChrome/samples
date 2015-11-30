// Handle cross-browser differences.
var context;
if (typeof AudioContext === 'function') {
  context = new AudioContext();
} else if (typeof webkitAudioContext === 'function') {
  context = new webkitAudioContext();
} else {
  ChromeSamples.setStatus('The Web Audio API is not supported in your browser');
}

if (context) {
  // Use the <audio> element to create the source node.
  var audioElement = document.querySelector('audio');
  var sourceNode = context.createMediaElementSource(audioElement);

  var gainNode = context.createGain();
  // Default gain is 1 (no change).
  // Less than 1 means audio is attenuated, and vice versa.
  gainNode.gain.value = 0.5;

  var filterNode = context.createBiquadFilter();
  // See https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-section
  filterNode.type = 'highpass';
  // Cutoff frequency: for highpass, audio is attenuated below this frequency.
  filterNode.frequency.value = 10000;

  sourceNode.connect(gainNode).connect(filterNode).connect(context.destination);
}
