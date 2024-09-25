let slideNumber = 1;

togglePipButton.addEventListener("click", async () => {
  try {
    if (video !== document.pictureInPictureElement)
      await video.requestPictureInPicture();
    else await document.exitPictureInPicture();
  } catch (error) {
    log(`> Argh! ${error}`);
  }
});

try {
  navigator.mediaSession.setActionHandler("previousslide", () => {
    log('> User clicked "Previous Slide" icon.');
    if (slideNumber > 1) slideNumber--;
    updateSlide();
  });
} catch (error) {
  log('Warning! The "previousslide" media session action is not supported.');
}

try {
  navigator.mediaSession.setActionHandler("nextslide", () => {
    log('> User clicked "Next Slide" icon.');
    slideNumber++;
    updateSlide();
  });
} catch (error) {
  log('Warning! The "nextslide" media session action is not supported.');
}

/* Picture-in-Picture canvas */

const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 512;
updateSlide();

const video = document.createElement("video");
video.srcObject = canvas.captureStream();
video.muted = true;
video.play();

/* Utils */

function updateSlide() {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "100px Google Sans,arial,sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`slide ${slideNumber}`, canvas.width / 2, canvas.height / 2, canvas.width);
}
