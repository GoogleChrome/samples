const audio = document.querySelector('audio');

if (MediaSource.isTypeSupported('audio/mp4; codecs="opus"')) {
  const mediaSource = new MediaSource();
  audio.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', function() {
    URL.revokeObjectURL(audio.src);

    const sourceBuffer = mediaSource.addSourceBuffer('audio/mp4; codecs="opus"');

    log('Fetching audio file...');
    fetch('https://storage.googleapis.com/media-session/bear-opus.mp4')
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
  log('Opus in ISO-BMFF with MSE is not supported on this platform.');
}
