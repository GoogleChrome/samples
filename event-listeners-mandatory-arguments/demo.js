ChromeSamples.log('Call document.body.addEventListener with no arguments.');
try {
  document.body.addEventListener();
} catch (error) {
  ChromeSamples.log('> ' + error.message + '\n');
}

ChromeSamples.log('Call document.body.addEventListener with one argument.');
try {
  document.body.addEventListener('click');
} catch (error) {
  ChromeSamples.log('> ' + error.message + '\n');
}

ChromeSamples.log('Call document.body.removeEventListener with no arguments.');
try {
  document.body.removeEventListener();
} catch (error) {
  ChromeSamples.log('> ' + error.message + '\n');
}

ChromeSamples.log('Call document.body.removeEventListener with one argument.');
try {
  document.body.removeEventListener('click');
} catch (error) {
  ChromeSamples.log('> ' + error.message + '\n');
}

// Example of valid usage:
var handler = function() {
  // Do something.
};
document.body.addEventListener('click', handler);
document.body.removeEventListener('click', handler);
