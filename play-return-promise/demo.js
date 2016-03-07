function startPlayback() {
  return document.querySelector('#music').play();
}

ChromeSamples.log('Attempting to start playback automatically...');

startPlayback().then(function() {
  ChromeSamples.log('The play() Promise resolved! Rock on!');
}).catch(function(error) {
  ChromeSamples.log('The play() Promise rejected!\nUse the Play button instead.\n' + error);

  var playButton = document.querySelector('#play');
  // The user interaction requirement will be met if playback starts via a click event.
  playButton.addEventListener('click', startPlayback);
  playButton.hidden = false;
});
