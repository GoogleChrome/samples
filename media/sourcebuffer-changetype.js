const mediaSource = new MediaSource();
const audio = document.querySelector('audio');
audio.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', function() {
  URL.revokeObjectURL(audio.src);
  feedAudioElement(0 /* index */);
});

const resources = [
  { url: 'bear-opus.webm',     type: 'audio/webm; codecs="opus"' },
  { url: 'bear-flac_frag.mp4', type: 'audio/mp4; codecs="flac"' }
];

async function feedAudioElement(index) {
  if (index == resources.length) {
    mediaSource.endOfStream();
    return;
  }

  try {
    let sourceBuffer;
    const resource = resources[index];

    if (mediaSource.sourceBuffers.length == 0) {
      log('Adding source buffer with type: ' + resource.type);
      sourceBuffer = mediaSource.addSourceBuffer(resource.type);
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
      feedAudioElement(++index);
    }, { once: true });

  } catch(error) {
    log('Argh! ' + error);
    feedAudioElement(++index);
  }
}
