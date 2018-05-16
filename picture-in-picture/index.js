togglePipButton.disabled = !document.pictureInPictureEnabled;

togglePipButton.addEventListener('click', async function(event) {
  togglePipButton.disabled = true;
  try {
    if (video !== document.pictureInPictureElement) {
      log('Requesting Picture-in-Picture...');
      const pipWindow = await video.requestPictureInPicture();
      log(`> Window size is ${pipWindow.width}x${pipWindow.height}`);
      pipWindow.addEventListener('resize', onPipWindowResize);
    } else {
      log('Exiting Picture-in-Picture...');
      await document.exitPictureInPicture();
    }
  } catch(error) {
    log(`> Argh! ${error}`);
  } finally {
    togglePipButton.disabled = false;
  }
});

video.addEventListener('enterpictureinpicture', function(event) {
  log('> Video entered Picture-in-Picture.');
});

video.addEventListener('leavepictureinpicture', function(event) {
  log('> Video left Picture-in-Picture.');
});

function onPipWindowResize(event) {
  const pipWindow = event.target;
  log(`> Window size is ${pipWindow.width}x${pipWindow.height}`);
}
