const video = document.querySelector('video');

const mediaSource = new MediaSource();
video.src = URL.createObjectURL(mediaSource);
  
mediaSource.addEventListener('sourceopen', function() {
  URL.revokeObjectURL(video.src);

  mediaSource.addSourceBuffer('video/webm; codecs="vp9"');

  log('Fetching video init segment...');
  fetchAndAppendSegment('bytes=0-299');
}, { once: true });

function onSetInfiniteDurationButtonClick() {
  log('User clicked "mediaSource.duration = +Infinity" button');
  // Makes video behave like a live stream.
  mediaSource.duration = +Infinity;
  logMediaInfo();
}

function onFetchAndAppend3To6MediaButtonClick() {
  log('Fetching video segment that starts at 3 seconds...');
  fetchAndAppendSegment('bytes=567140-1196488');
}

function onSetLiveSeekableRangeButtonClick(event) {
  const re = /mediaSource\.setLiveSeekableRange\((\d+), (\d+)\)/;
  const start = Number(re.exec(event.target.textContent)[1]);
  const end = Number(re.exec(event.target.textContent)[2]);
  log(`User clicked "mediaSource.setLiveSeekableRange(${start}, ${end})" button`);
  mediaSource.setLiveSeekableRange(start, end);
  logMediaInfo();
}

function onClearLiveSeekableRangeButtonClick() {
  log('User clicked "mediaSource.clearLiveSeekableRange()" button');
  mediaSource.clearLiveSeekableRange();
  logMediaInfo();
}

function onRemoveMediaSegmentButtonClick() {
  const sourceBuffer = mediaSource.sourceBuffers[0];

  log('User clicked "sourceBuffer.remove(3, 6)" button');
  sourceBuffer.remove(3 /* start */, 6 /* end*/);
  sourceBuffer.addEventListener('updateend', function() {
    logMediaInfo();
  }, { once: true });
}

function onSetFiniteDurationButtonClick() {
  log('User clicked "mediaSource.duration = 6" button');
  mediaSource.duration = 6;
  logMediaInfo();
}

function onEndOfStreamButtonClick() {
  log('User clicked "mediaSource.endOfStream()" button');
  mediaSource.endOfStream();
  mediaSource.addEventListener('sourceended', function() {
    logMediaInfo();
  }, { once: true });
}

/* Utils */

function fetchAndAppendSegment(range) {
  const videoUrl = 'https://storage.googleapis.com/media-session/sample.webm';
  const sourceBuffer = mediaSource.sourceBuffers[0];

  fetch(videoUrl, { headers: { range } })
  .then(response => response.arrayBuffer())
  .then(data => {
    sourceBuffer.appendBuffer(data);
    sourceBuffer.addEventListener('updateend', function() {
      logMediaInfo();
    }, { once: true });
  });
}

function logMediaInfo() {
  log(`> Seekable time ranges: ${timeRangesToString(video.seekable)}`);
  log(`> Buffered time ranges: ${timeRangesToString(video.buffered)}`);
  log(`> MediaSource duration: ${mediaSource.duration}`);
  log('');
}

function timeRangesToString(ranges) {
  var s = "{";
  for (var i = 0; i < ranges.length; ++i) {
    s += " [" + ranges.start(i).toFixed(3) + ", " + ranges.end(i).toFixed(3) + ")";
  }
  return s + " }";
}
