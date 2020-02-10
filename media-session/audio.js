let audio = document.createElement('audio');

let playlist = getAwesomePlaylist();
let index = 0;

function onPlayButtonClick() {
  playAudio();
}

function playAudio() {
  audio.src = playlist[index].src;
  audio.play()
  .then(_ => updateMetadata())
  .catch(error => log(error));
}

function updateMetadata() {
  let track = playlist[index];

  log('Playing ' + track.title + ' track...');
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: track.album,
    artwork: track.artwork
  });

  // Media is loaded, set the duration.
  updatePositionState();
}

/* Position state (supported since Chrome 81) */

function updatePositionState() {
  if ('setPositionState' in navigator.mediaSession) {
    log('Updating position state...');
    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: audio.currentTime
    });
  }
}

/* Previous Track & Next Track */

navigator.mediaSession.setActionHandler('previoustrack', function() {
  log('> User clicked "Previous Track" icon.');
  index = (index - 1 + playlist.length) % playlist.length;
  playAudio();
});

navigator.mediaSession.setActionHandler('nexttrack', function() {
  log('> User clicked "Next Track" icon.');
  index = (index + 1) % playlist.length;
  playAudio();
});

audio.addEventListener('ended', function() {
  // Play automatically the next track when audio ends.
  index = (index - 1 + playlist.length) % playlist.length;
  playAudio();
});

/* Seek Backward & Seek Forward */

let defaultSkipTime = 10; /* Time to skip in seconds by default */

navigator.mediaSession.setActionHandler('seekbackward', function(event) {
  log('> User clicked "Seek Backward" icon.');
  const skipTime = event.seekOffset || defaultSkipTime;
  audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
  updatePositionState();
});

navigator.mediaSession.setActionHandler('seekforward', function(event) {
  log('> User clicked "Seek Forward" icon.');
  const skipTime = event.seekOffset || defaultSkipTime;
  audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
  updatePositionState();
});

/* Play & Pause */

navigator.mediaSession.setActionHandler('play', async function() {
  log('> User clicked "Play" icon.');
  await audio.play();
  navigator.mediaSession.playbackState = "playing";
  // Do something more than just playing audio...
});

navigator.mediaSession.setActionHandler('pause', function() {
  log('> User clicked "Pause" icon.');
  audio.pause();
  navigator.mediaSession.playbackState = "paused";
  // Do something more than just pausing audio...
});

/* Stop (supported since Chrome 77) */

try {
  navigator.mediaSession.setActionHandler('stop', function() {
    log('> User clicked "Stop" icon.');
    // TODO: Clear UI playback...
  });
} catch(error) {
  log('Warning! The "stop" media session action is not supported.');
}

/* Seek To (supported since Chrome 78) */

try {
  navigator.mediaSession.setActionHandler('seekto', function(event) {
    log('> User clicked "Seek To" icon.');
    if (event.fastSeek && ('fastSeek' in audio)) {
      audio.fastSeek(event.seekTime);
      return;
    }
    audio.currentTime = event.seekTime;
    updatePositionState();
  });
} catch(error) {
  log('Warning! The "seekto" media session action is not supported.');
}

/* Utils */

function getAwesomePlaylist() {
  const BASE_URL = 'https://storage.googleapis.com/media-session/';

  return [{
      src: BASE_URL + 'sintel/snow-fight.mp3',
      title: 'Snow Fight',
      artist: 'Jan Morgenstern',
      album: 'Sintel',
      artwork: [
        { src: BASE_URL + 'sintel/artwork-96.png',  sizes: '96x96',   type: 'image/png' },
        { src: BASE_URL + 'sintel/artwork-128.png', sizes: '128x128', type: 'image/png' },
        { src: BASE_URL + 'sintel/artwork-192.png', sizes: '192x192', type: 'image/png' },
        { src: BASE_URL + 'sintel/artwork-256.png', sizes: '256x256', type: 'image/png' },
        { src: BASE_URL + 'sintel/artwork-384.png', sizes: '384x384', type: 'image/png' },
        { src: BASE_URL + 'sintel/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }, {
      src: BASE_URL + 'big-buck-bunny/prelude.mp3',
      title: 'Prelude',
      artist: 'Jan Morgenstern',
      album: 'Big Buck Bunny',
      artwork: [
        { src: BASE_URL + 'big-buck-bunny/artwork-96.png',  sizes: '96x96',   type: 'image/png' },
        { src: BASE_URL + 'big-buck-bunny/artwork-128.png', sizes: '128x128', type: 'image/png' },
        { src: BASE_URL + 'big-buck-bunny/artwork-192.png', sizes: '192x192', type: 'image/png' },
        { src: BASE_URL + 'big-buck-bunny/artwork-256.png', sizes: '256x256', type: 'image/png' },
        { src: BASE_URL + 'big-buck-bunny/artwork-384.png', sizes: '384x384', type: 'image/png' },
        { src: BASE_URL + 'big-buck-bunny/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }, {
      src: BASE_URL + 'elephants-dream/the-wires.mp3',
      title: 'The Wires',
      artist: 'Jan Morgenstern',
      album: 'Elephants Dream',
      artwork: [
        { src: BASE_URL + 'elephants-dream/artwork-96.png',  sizes: '96x96',   type: 'image/png' },
        { src: BASE_URL + 'elephants-dream/artwork-128.png', sizes: '128x128', type: 'image/png' },
        { src: BASE_URL + 'elephants-dream/artwork-192.png', sizes: '192x192', type: 'image/png' },
        { src: BASE_URL + 'elephants-dream/artwork-256.png', sizes: '256x256', type: 'image/png' },
        { src: BASE_URL + 'elephants-dream/artwork-384.png', sizes: '384x384', type: 'image/png' },
        { src: BASE_URL + 'elephants-dream/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }, {
      src: BASE_URL + 'caminandes/original-score.mp3',
      title: 'Original Score',
      artist: 'Jan Morgenstern',
      album: 'Caminandes 2: Gran Dillama',
      artwork: [
        { src: BASE_URL + 'caminandes/artwork-96.png',  sizes: '96x96',   type: 'image/png' },
        { src: BASE_URL + 'caminandes/artwork-128.png', sizes: '128x128', type: 'image/png' },
        { src: BASE_URL + 'caminandes/artwork-192.png', sizes: '192x192', type: 'image/png' },
        { src: BASE_URL + 'caminandes/artwork-256.png', sizes: '256x256', type: 'image/png' },
        { src: BASE_URL + 'caminandes/artwork-384.png', sizes: '384x384', type: 'image/png' },
        { src: BASE_URL + 'caminandes/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }];
}
