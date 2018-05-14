if (!document.pictureInPictureEnabled) {
  log('Picture-in-Picture is disabled by system.');
}

togglePipButton.addEventListener('click', async function(event) {
  togglePipButton.disabled = true;
  try {
    if (video === document.pictureInPictureElement) {
      log('Exiting Picture-in-Picture...');
      await document.exitPictureInPicture();
    } else {
      log('Requesting Picture-in-Picture...');
      const pipWindow = await video.requestPictureInPicture();
      log('Picture-in-Picture window is displayed.');
      pipWindow.addEventListener('resize', onPipWindowResize);
    }
  } catch(error) {
    log(error.messsage);
  } finally {
    togglePipButton.disabled = false;
  }
});

function onPipWindowResize(event) {
  const pipWindow = event.target;
  log(`Picture-in-Picture window size is ${pipWindow.width}x${pipWindow.height}`);
}

video.addEventListener('enterpictureinpicture', function(event) {
  log('Video entered Picture-in-Picture.');
});

video.addEventListener('leavepictureinpicture', function(event) {
  log('Video left Picture-in-Picture.');
});
