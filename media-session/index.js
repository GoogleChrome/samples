let audio = document.createElement('audio');

let playlist = getPlaylist();
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

function getPlaylist() {
  return [{
      src: 'jam.ogg',
      title: 'Title #1',
      artist: 'Artist #1',
      album: 'Album #1',
      artwork: getArtwork('1')
    }, {
      src: 'jam.ogg',
      title: 'Title #2',
      artist: 'Artist #2',
      album: 'Album #2',
      artwork: getArtwork('2')
    }, {
      src: 'jam.ogg',
      title: 'Title #3',
      artist: 'Artist #3',
      album: 'Album #3',
      artwork: getArtwork('3')
    }, {
      src: 'jam.ogg',
      title: 'Title #4',
      artist: 'Artist #4',
      album: 'Album #4',
      artwork: getArtwork('4')
    }, {
      src: 'jam.ogg',
      title: 'Title #5',
      artist: 'Artist #5',
      album: 'Album #5',
      artwork: getArtwork('5')
    }];
}

function getArtwork(text) {
  return [{
      src: 'https://dummyimage.com/96x96?text=' + text,
      sizes: '96x96',
      type: 'image/png'
    }, {
      src: 'https://dummyimage.com/128x128?text=' + text,
      sizes: '128x128',
      type: 'image/png'
    }, {
      src: 'https://dummyimage.com/192x192?text=' + text,
      sizes: '192x192',
      type: 'image/png'
    }, {
      src: 'https://dummyimage.com/256x256?text=' + text,
      sizes: '256x256',
      type: 'image/png'
    }, {
      src: 'https://dummyimage.com/384x384?text=' + text,
      sizes: '384x384',
      type: 'image/png'
    }, {
      src: 'https://dummyimage.com/512x512?text=' + text,
      sizes: '512x512',
      type: 'image/png'
    }];
}
