let audio = document.createElement('audio');

let playlist = getAwesomePlaylist();
let index = 0;

function onPlayButtonClick() {
  playAudio();
}

async function playAudio() {
  let track = playlist[index];
  audio.src = track.src;
  try {
    // Play audio
    await audio.play();

    // Update Media Session metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: track.artwork
    });

    // Show track album in a Picture-in-Picture window
    await showPictureInPictureWindow();

    log(`Playing "${track.album}" audio track in Picture-in-Picture...`);
  } catch(error) {
    log(error);
  }
}

/* Picture-in-Picture Canvas */

const canvas = document.createElement('canvas');
canvas.width = canvas.height = 512;

const video = document.createElement('video');
video.srcObject = canvas.captureStream();
video.muted = true;

async function showPictureInPictureWindow() {
  const image = new Image();
  image.crossOrigin = true;
  image.src = [...navigator.mediaSession.metadata.artwork].pop().src;
  await image.decode();

  canvas.getContext('2d').drawImage(image, 0, 0, 512, 512);
  await video.play();
  await video.requestPictureInPicture();
}

/* Previous Track & Next Track */

navigator.mediaSession.setActionHandler('previoustrack', function() {
  log('> User clicked "Previous Track" button.');
  index = (index - 1 + playlist.length) % playlist.length;
  playAudio();
});

navigator.mediaSession.setActionHandler('nexttrack', function() {
  log('> User clicked "Next Track" button.');
  index = (index + 1) % playlist.length;
  playAudio();
});

audio.addEventListener('ended', function() {
  // Play automatically the next track when audio ends.
  index = (index - 1 + playlist.length) % playlist.length;
  playAudio();
});

/* Play & Pause */

navigator.mediaSession.setActionHandler('play', function() {
  log('> User clicked "Play" button.');
  audio.play();
  if (document.pictureInPictureElement)
    document.pictureInPictureElement.play();
});

navigator.mediaSession.setActionHandler('pause', function() {
  log('> User clicked "Pause" button.');
  audio.pause();
  if (document.pictureInPictureElement)
    document.pictureInPictureElement.pause();
});

/* Feature Support */

playButton.disabled = !document.pictureInPictureEnabled;

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
