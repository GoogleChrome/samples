if (window.matchMedia("(display-mode: browser)").matches)
  log('Warning! Install this sample app first.');
else {
  // If Progressive Web App is installed and running in a window,
  // request user camera and show its stream in the video.
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    return video.play();

    // User can now show/hide window and video will enter and exit
    // automatically Picture-in-Picture when the document's visibility
    // changes.
  });
}

video.addEventListener('enterpictureinpicture', function(event) {
  log('> Video entered Picture-in-Picture');
});

video.addEventListener('leavepictureinpicture', function(event) {
  log('> Video left Picture-in-Picture');
});

/* Feature support */

if (!('autoPictureInPicture' in HTMLVideoElement.prototype)) {
  log('Warning! Auto Picture-in-Picture is not available.');
}
