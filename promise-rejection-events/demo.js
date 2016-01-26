// Use a Map to keep track of rejected promises and their corresponding reason.
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
var unhandledRejections = new Map();

window.addEventListener('unhandledrejection', event => {
  // Keep track of rejected promises by adding them to the Map.
  unhandledRejections.set(event.promise, event.reason);
});

window.addEventListener('rejectionhandled', event => {
  // If a previously rejected promise is handled, remove it from the Map.
  unhandledRejections.delete(event.promise);
});

function generateRejectedPromise() {
  // Create a promise which immediately rejects with a given reason.
  var rejectedPromise = Promise.reject('Error at ' +
    new Date().toLocaleTimeString());

  // 50% of the time, use .catch() to handle the rejection.
  if (Math.random() > 0.5) {
    // We need to handle the rejection "after the fact" in order to trigger a
    // unhandledrejection followed by rejectionhandled. Here we simulate that
    // via a setTimeout(), but in a real-world system this might take place due
    // to, e.g., fetch()ing resources at startup and then handling any rejected
    // requests at some point later on.
    setTimeout(() => {
      // We need to provide an actual function to .catch() or else the promise
      // won't be considered handled. Let's just log the .catch().
      rejectedPromise.catch(error => {
        ChromeSamples.log(error, 'was handled via catch().');
      });
    }, 1);
  }
}

function logUnhandledRejections() {
  ChromeSamples.log('[Unhandled Rejections]');
  for (var reason of unhandledRejections.values()) {
    ChromeSamples.log(' ', reason);
  }
  unhandledRejections.clear();
}

setInterval(generateRejectedPromise, 1000);
setInterval(logUnhandledRejections, 5000);
