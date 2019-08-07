const encryptedMediaConfig = {
  type: 'media-source', // or 'file'
  audio: {
    contentType: 'audio/webm; codecs=opus',
    channels: '2', // audio channels used by the track
    bitrate: 132266, // number of bits used to encode a second of audio
    samplerate: 48000 // number of samples of audio carried per second
  },
  video: {
    contentType: 'video/webm; codecs="vp09.00.10.08"',
    width: 1920,
    height: 1080,
    bitrate: 2646242, // number of bits used to encode a second of video
    framerate: '25' // number of frames used in one second
  },
  keySystemConfiguration: {
    keySystem: 'com.widevine.alpha',
    videoRobustness: 'SW_SECURE_DECODE' // Widevine L3
  }
};

navigator.mediaCapabilities.decodingInfo(encryptedMediaConfig).then(result => {
  if (!result.supported) {
    log('Argh! This encrypted media configuration is not supported.');
    return;
  }

  if (!result.keySystemAccess) {
    log('Argh! Encrypted media support is not available.')
    return;
  }

  log('This encrypted media configuration is supported.\n' +
      'Playback should be' +
      (result.smooth ? '' : ' NOT') + ' smooth and' +
      (result.powerEfficient ? '' : ' NOT') + ' power efficient.');

  // TODO: Use `result.keySystemAccess.createMediaKeys()` to setup EME playback.
});
