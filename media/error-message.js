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
