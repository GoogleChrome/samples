const audio = document.querySelector('audio');

function onButtonClick(event) {
  const text = event.target.textContent;
  const playbackRate = Number(/playbackRate = (-?\d+([/.]\d+)?)/.exec(text)[1]);

  try {
    audio.playbackRate = playbackRate;
  } catch(error) {
    log('> Error: ' + error.message);
  }
}

audio.addEventListener('ratechange', function(event) {
  log('> Playback rate changed to ' + event.target.playbackRate);
});
 
