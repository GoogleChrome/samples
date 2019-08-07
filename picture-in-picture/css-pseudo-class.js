togglePipButton.addEventListener('click', async function(event) {
  togglePipButton.disabled = true;
  try {

    if (video !== document.pictureInPictureElement)
      await video.requestPictureInPicture();
    else
      await document.exitPictureInPicture();

  } catch(error) {
    log(`> Argh! ${error}`);
  } finally {
    togglePipButton.disabled = false;
  }
});

/* Feature support */

if ('pictureInPictureEnabled' in document) {
  // Set button ability depending on whether Picture-in-Picture can be used.
  setPipButton();
  video.addEventListener('loadedmetadata', setPipButton);
  video.addEventListener('emptied', setPipButton);
} else {
  // Hide button if Picture-in-Picture is not supported.
  togglePipButton.hidden = true;
}

function setPipButton() {
  togglePipButton.disabled = (video.readyState === 0) ||
                             !document.pictureInPictureEnabled ||
                             video.disablePictureInPicture;
}
