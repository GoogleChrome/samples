navigator.mediaDevices.getUserMedia({video: { zoom: true }})
.then(mediaStream => {
  document.querySelector('video').srcObject = mediaStream;

  const [track] = mediaStream.getVideoTracks();
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();

  const input = document.querySelector('input[type="range"]');

  // Check whether zoom is supported or not.
  if (!('zoom' in settings)) {
    return Promise.reject('Zoom is not supported by ' + track.label);
  }

  // Map zoom to a slider element.
  input.min = capabilities.zoom.min;
  input.max = capabilities.zoom.max;
  input.step = capabilities.zoom.step;
  input.value = settings.zoom;
  input.oninput = function(event) {
    track.applyConstraints({advanced: [ {zoom: event.target.value} ]});
  }
  input.hidden = false;
})
.catch(error => ChromeSamples.log('Argh!', error.name || error));
