var previousX = 0;
var previousY = 0;
var previousT = 0;

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

  ChromeSamples.setStatus(velocityInPixelsPerSecond);

  previousX = event.screenX;
  previousY = event.screenY;
  previousT = event.timeStamp;
});
