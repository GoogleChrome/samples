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

  log('Playing "' + track.title + '" track...');
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: track.album,
    artwork: track.artwork
  });
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

let skipTime = 10; /* Time to skip in seconds */

navigator.mediaSession.setActionHandler('seekbackward', function() {
  log('> User clicked "Seek Backward" icon.');
  audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
});

navigator.mediaSession.setActionHandler('seekforward', function() {
  log('> User clicked "Seek Forward" icon.');
  audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
});

/* Utils */

function getAwesomePlaylist() {
  return [{
      src: 'https://storage.googleapis.com/media-session/sintel/snow-fight.mp3',
      title: 'Snow Fight',
      artist: 'Jan Morgenstern',
      album: 'Sintel',
      artwork: [
        { src: 'https://storage.googleapis.com/media-session/sintel/artwork-96.png',  sizes: '96x96',   type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/sintel/artwork-128.png', sizes: '128x128', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/sintel/artwork-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/sintel/artwork-256.png', sizes: '256x256', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/sintel/artwork-384.png', sizes: '384x384', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/sintel/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }, {
      src: 'https://storage.googleapis.com/media-session/big-buck-bunny/prelude.mp3',
      title: 'Prelude',
      artist: 'Jan Morgenstern',
      album: 'Big Buck Bunny',
      artwork: [
        { src: 'https://storage.googleapis.com/media-session/big-buck-bunny/artwork-96.png',  sizes: '96x96',   type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/big-buck-bunny/artwork-128.png', sizes: '128x128', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/big-buck-bunny/artwork-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/big-buck-bunny/artwork-256.png', sizes: '256x256', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/big-buck-bunny/artwork-384.png', sizes: '384x384', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/big-buck-bunny/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }, {
      src: 'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3',
      title: 'The Wires',
      artist: 'Jan Morgenstern',
      album: 'Elephants Dream',
      artwork: [
        { src: 'https://storage.googleapis.com/media-session/elephants-dream/artwork-96.png',  sizes: '96x96',   type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/elephants-dream/artwork-128.png', sizes: '128x128', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/elephants-dream/artwork-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/elephants-dream/artwork-256.png', sizes: '256x256', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/elephants-dream/artwork-384.png', sizes: '384x384', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/elephants-dream/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }, {
      src: 'https://storage.googleapis.com/media-session/caminandes/original-score.mp3',
      title: 'Original Score',
      artist: 'Jan Morgenstern',
      album: 'Caminandes 2: Gran Dillama',
      artwork: [
        { src: 'https://storage.googleapis.com/media-session/caminandes/artwork-96.png',  sizes: '96x96',   type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/caminandes/artwork-128.png', sizes: '128x128', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/caminandes/artwork-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/caminandes/artwork-256.png', sizes: '256x256', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/caminandes/artwork-384.png', sizes: '384x384', type: 'image/png' },
        { src: 'https://storage.googleapis.com/media-session/caminandes/artwork-512.png', sizes: '512x512', type: 'image/png' },
      ]
    }];
}
