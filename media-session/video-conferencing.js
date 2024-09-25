let video = document.querySelector('video');

let isMicrophoneActive = false;
let isCameraActive = false;

openCameraButton.addEventListener("click", async () => {
  try {
    const constraints = { video: true, audio: true };
    video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
    // Activate the microphone and the camera.
    isMicrophoneActive = true;
    isCameraActive = true;
    navigator.mediaSession.setMicrophoneActive(isMicrophoneActive);
    navigator.mediaSession.setCameraActive(isCameraActive);
  } catch (error) {
    log(`> Argh! ${error}`);
  }
});

togglePipButton.addEventListener("click", async () => {
  try {
    if (video !== document.pictureInPictureElement)
      await video.requestPictureInPicture();
    else await document.exitPictureInPicture();
  } catch (error) {
    log(`> Argh! ${error}`);
  }
});

autoPipCheckbox.addEventListener('input', () => {
  try {
    if (!autoPipCheckbox.checked) {
      // Disable automatically enter Picture-in-Picture.
      navigator.mediaSession.setActionHandler('enterpictureinpicture', null);
      return;
    }
    // Request browser to automatically enter Picture-in-Picture when eligible.
    navigator.mediaSession.setActionHandler('enterpictureinpicture', async () => {
      log('> Video is eligible for Automatic Picture-in-Picture.');
      await video.requestPictureInPicture();
    });
  } catch (error) {
    log('Warning! The "enterpictureinpicture" media session action is not supported.');
  }
});

try {
  navigator.mediaSession.setActionHandler('togglemicrophone', () => {
    log('> User clicked "Toggle Mic" icon.');
    // TODO: Handle muting or unmuting the microphone.
    // Eventually update the microphone state.
    isMicrophoneActive = !isMicrophoneActive;
    navigator.mediaSession.setMicrophoneActive(isMicrophoneActive);
  });
} catch(error) {
  log('Warning! The "togglemicrophone" media session action is not supported.');
}

try {
  navigator.mediaSession.setActionHandler('togglecamera', () => {
    log('> User clicked "Toggle Camera" icon.');
    // TODO: Handle turning on or off the camera.
    // Eventually update the camera state.
    isCameraActive = !isCameraActive;
    navigator.mediaSession.setCameraActive(isCameraActive);
  });
} catch(error) {
  log('Warning! The "togglecamera" media session action is not supported.');
}

try {
  navigator.mediaSession.setActionHandler("hangup", () => {
    log('> User clicked "Hang Up" icon.');
    // Stop video stream.
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => {
      track.stop();
    });
    video.srcObject = null;
    // Exit Picture-in-Picture.
    document.exitPictureInPicture();
  });
} catch (error) {
  log('Warning! The "hangup" media session action is not supported.');
}
