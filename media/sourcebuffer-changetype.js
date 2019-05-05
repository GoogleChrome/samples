const mediaSource = new MediaSource();
const audio = document.querySelector('audio');
audio.src = URL.createObjectURL(mediaSource);

const resources = [
  {
    url: 'https://storage.googleapis.com/media-session/bear-opus.webm',
    type: 'audio/webm; codecs="opus"'
  }, {
    url: 'https://storage.googleapis.com/media-session/bear-flac_frag.mp4',
    type: 'audio/mp4; codecs="flac"'
  }
];

mediaSource.addEventListener('sourceopen', function() {
  URL.revokeObjectURL(audio.src);
  feedAudioElement(0 /* resources index */);
});

async function feedAudioElement(resourcesIndex) {
  if (resourcesIndex == resources.length) {
    mediaSource.endOfStream();
    return;
  }

  try {
    let sourceBuffer;
    const resource = resources[resourcesIndex];

    if (mediaSource.sourceBuffers.length == 0) {
      log('Adding source buffer with type: ' + resource.type);
      sourceBuffer = mediaSource.addSourceBuffer(resource.type);
      // The 'sequence' mode is used here purely for simplicity. A more
      // sophisticated app would know which timestampOffset and appendWindow to
      // use for each appendBuffer operation when splicing media.
      sourceBuffer.mode = 'sequence';
    } else {
      log('Changing source buffer type to: ' + resource.type);
      sourceBuffer = mediaSource.sourceBuffers[0];
      sourceBuffer.changeType(resource.type);
    }

    log('Fetching audio data...');
    const response = await fetch(resource.url);
    const data = await response.arrayBuffer();

    log('Appending data to audio element...');
    sourceBuffer.appendBuffer(data);
    sourceBuffer.addEventListener('updateend', function() {
      log('Source buffer updated');
      feedAudioElement(++resourcesIndex);
    }, { once: true });

  } catch(error) {
    log('Argh! ' + error);
    feedAudioElement(++resourcesIndex);
  }
}
