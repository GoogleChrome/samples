const audio = document.querySelector('audio');

if (MediaSource.isTypeSupported('audio/mp4; codecs="flac"')) {
  const mediaSource = new MediaSource();
  audio.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', function() {
    URL.revokeObjectURL(audio.src);

    const sourceBuffer = mediaSource.addSourceBuffer('audio/mp4; codecs="flac"');

    log('Fetching audio file...');
    fetch('https://storage.googleapis.com/media-session/flac.mp4')
    .then(response => response.arrayBuffer())
    .then(data => {
      sourceBuffer.appendBuffer(data);
      sourceBuffer.addEventListener('updateend', function() {
        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
          mediaSource.endOfStream();
          log('Audio is ready to play!');
        }
      });
    });
  });
} else {
  log('FLAC in ISO-BMFF with MSE is not supported on this platform.');
}

