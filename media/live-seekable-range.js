const video = document.createElement('video');

const mediaSource = new MediaSource();
video.src = URL.createObjectURL(mediaSource);
  
mediaSource.addEventListener('sourceopen', function() {
  URL.revokeObjectURL(video.src);

  const videoUrl = 'https://storage.googleapis.com/media-session/sample.webm';
  const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9"');

  // Makes video behave like a live stream.
  mediaSource.duration = +Infinity;

  log('Fetching video init segment...');
  fetch(videoUrl, { headers: { range: 'bytes=0-299' } })
  .then(response => response.arrayBuffer())
  .then(data => {

    // Append video init segment.
    sourceBuffer.appendBuffer(data);
    sourceBuffer.addEventListener('updateend', function() {
      logTimeRanges();

      log('Fetching video segment that starts at 3 seconds...');
      fetch(videoUrl, { headers: { range: 'bytes=567140-1196488' } })
      .then(response => response.arrayBuffer())
      .then(data => {

        // Append video segment that starts at 3 seconds.
        sourceBuffer.appendBuffer(data);
        sourceBuffer.addEventListener('updateend', function() {
          logTimeRanges();
        }, { once: true });

      });
    }, { once: true });
  });
});

function onSetLiveSeekableRangeButtonClick() {
  log('User clicked "mediaSource.setLiveSeekableRange(40, 42)" button');
  mediaSource.setLiveSeekableRange(40 /* start */, 42 /* end */);
  logTimeRanges();
}

function onClearLiveSeekableRangeButtonClick() {
  log('User clicked "mediaSource.clearLiveSeekableRange()" button');
  mediaSource.clearLiveSeekableRange();
  logTimeRanges();
}

function onRemoveMediaSegmentButtonClick() {
  log('User clicked "sourceBuffer.remove(3, 6)" button');
  mediaSource.sourceBuffers[0].remove(3 /* start */, 6 /* end*/);
  mediaSource.sourceBuffers[0].addEventListener('updateend', function() {
    logTimeRanges();
  }, { once: true });
}

/* Util */

function logTimeRanges() {
  log(`> Seekable time ranges: ${timeRangesToString(video.seekable)}`);
  log(`> Buffered time ranges: ${timeRangesToString(video.buffered)}`);
  log('');
}

function timeRangesToString(ranges) {
  var s = "{";
  for (var i = 0; i < ranges.length; ++i) {
    s += " [" + ranges.start(i).toFixed(3) + ", " + ranges.end(i).toFixed(3) + ")";
  }
  return s + " }";
}
