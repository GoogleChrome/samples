var offsetFromEpoch = 0;
var previousX = 0;
var previousY = 0;
var previousT = 0;

window.addEventListener('load', function(event) {
  // Use a simple heuristic to determine the offset from the epoch:
  // If the timestamp value is less than the current time,
  // then it's almost certainly a DOMHighResTimeStamp. Adding timestamp to
  // performance.timing.navigationStart should give a value relative to
  // the epoch, which could be passed in to the Date constructor.
  // Otherwise, it's a DOMTimeStamp, and is already relative to the epoch.
  if (event.timeStamp < Date.now()) {
    offsetFromEpoch = performance.timing.navigationStart;
  }

  // While a 'mousemove' listener is being used for the purposes of this
  // example, the new timeStamp resolution applies to all Event types.
  window.addEventListener('mousemove', calculateVelocity);
});

function calculateVelocity(event) {
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

  // Contrived example to illustrate how to use offsetFromEpoch to get a Date
  // that corresponds to event.timeStamp.
  var date = new Date(event.timeStamp + offsetFromEpoch);

  ChromeSamples.setStatus(velocityInPixelsPerSecond + ' as of ' +
    date.toLocaleTimeString());

  previousX = event.screenX;
  previousY = event.screenY;
  previousT = event.timeStamp;
}
