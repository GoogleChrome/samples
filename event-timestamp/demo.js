var dateNowAtLoad = Date.now();
var offsetFromEpoch;

var previousX = 0;
var previousY = 0;
var previousT = 0;

function calculateDateForTimestamp(timestamp) {
  if (offsetFromEpoch === undefined) {
    // When we don't yet know what the offset should be, use a simple heuristic:
    // If the timestamp value is less than the time this JS was first loaded,
    // then it's almost certainly a DOMHighResTimeStamp. Adding timestamp to
    // performance.timing.navigationStart should give a value relative to
    // the epoch, which could be passed in to the Date constructor.
    // Otherwise, it's a DOMTimeStamp, and is already relative to the epoch.
    offsetFromEpoch = (timestamp < dateNowAtLoad) ?
      performance.timing.navigationStart : 0;
  }

  return new Date(offsetFromEpoch + timestamp);
}

// While a 'mousemove' listener is being used for the purposes of this
// example, the new timeStamp resolution applies to all Event types.
window.addEventListener('mousemove', function(event) {
  var Δx = event.screenX - previousX;
  var Δy = event.screenY - previousY;
  var Δd = Math.sqrt(Math.pow(Δx, 2) + Math.pow(Δy, 2));

  // event.timeStamp will always represent a value in milliseconds.
  // In supported browsers, the value will have a microsecond resolution, and
  // therefore might include a fractional number of milliseconds.
  // Older browsers only support a millisecond resolution, and the value will
  // always be a whole number.
  var Δt = event.timeStamp - previousT;

  // Multiply by 1000 to go from milliseconds to seconds.
  var velocityInPixelsPerSecond = Δd / Δt * 1000;

  // Contrived example to illustrate how to convert event.timeStamp to a Date.
  var date = calculateDateForTimestamp(event.timeStamp);

  ChromeSamples.setStatus(velocityInPixelsPerSecond + ' as of ' +
    date.toLocaleTimeString());

  previousX = event.screenX;
  previousY = event.screenY;
  previousT = event.timeStamp;
});
