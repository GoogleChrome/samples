const mediaConfig = {
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
  }
};

navigator.mediaCapabilities.decodingInfo(mediaConfig).then(result => {
  log('This configuration is' +
      (result.supported ? '' : ' NOT') + ' supported,' +
      (result.smooth ? '' : ' NOT') + ' smooth and' +
      (result.powerEfficient ? '' : ' NOT') + ' power efficient.');
});
