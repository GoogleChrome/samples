try {
  navigator.mediaSession.setActionHandler('skipad', onSkipAdButtonClick);
  log('The Picture-in-Picture window will show a "Skip Ad" button.');
} catch(error) {
  log('Argh! The "Skip Ad" media session action is not supported.');
}

// Hide "Skip Ad" button when user clicks it and play another video.
function onSkipAdButtonClick() {
  log('> User clicked "Skip Ad" button.');
  navigator.mediaSession.setActionHandler('skipad', null);

  video.src = "https://storage.googleapis.com/media-session/caminandes/short.mp4";
  video.play();
}

enterPictureInPictureButton.addEventListener('click', async () => {
  await video.play();
  await video.requestPictureInPicture();
});