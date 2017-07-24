let video = document.createElement('video');

video.addEventListener('error', function(event) {
  ChromeSamples.log('Error Message: ' + video.error.message);
});



emptySrcButton.addEventListener('click', function() {
  video.src= '';
});

nonExistentFileButton.addEventListener('click', function() {
  video.src = 'nonExistentFile.webm';
});

invalidFileButton.addEventListener('click', function() {
  video.src = 'https://storage.googleapis.com/media-error/no_streams.webm';
});

chooseFileButton.addEventListener('change', function() {
  const file = chooseFileButton.files[0];
  video.src = URL.createObjectURL(file);
});

video.addEventListener('canplay', function() {
  ChromeSamples.log('"canplay" event received');
});

