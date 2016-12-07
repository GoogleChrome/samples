navigator.mediaDevices.getUserMedia({video: true})
.then(mediaStream => {
  document.querySelector('video').srcObject = mediaStream;

  const track = mediaStream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(track);

  return imageCapture.getPhotoCapabilities()
  .then(photoCapabilities => {
    // Check whether zoom is supported or not.
    if (!photoCapabilities.zoom.min && !photoCapabilities.zoom.max) {
      return Promise.reject('Zoom is not supported by ' + track.label);
    }

    // Map zoom to a slider element.
    const input = document.querySelector('input[type="range"]');
    input.min = photoCapabilities.zoom.min;
    input.max = photoCapabilities.zoom.max;
    input.step = photoCapabilities.zoom.step;
    input.value = photoCapabilities.zoom.current;
    input.oninput = function(event) {
      imageCapture.setOptions({zoom: event.target.value});
    }
  });
})
.catch(error => ChromeSamples.log('Argh!', error.name || error));
