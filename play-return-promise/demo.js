function startPlayback() {
  return document.querySelector('#music').play();
}

ChromeSamples.log('Attempting to play automatically...');

startPlayback().then(function() {
  ChromeSamples.log('The play() Promise fulfilled! Rock on!');
}).catch(function(error) {
  ChromeSamples.log('The play() Promise rejected!');
  ChromeSamples.log('Use the Play button instead.');
  ChromeSamples.log(error);

  var playButton = document.querySelector('#play');
  // The user interaction requirement is met if
  // playback is triggered via a click event.
  playButton.addEventListener('click', startPlayback);
  playButton.hidden = false;
});
