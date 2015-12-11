var greenButton = document.querySelector('#greenButton');
var redButton = document.querySelector('#redButton');

greenButton.addEventListener('click', function(event) {
  if (event.isTrusted) {
    ChromeSamples.log('User clicked the green button. It is a trusted event.');
  } else {
    ChromeSamples.log('User did NOT click the green button.');
  }
});

redButton.addEventListener('click', function() {
  greenButton.click();
});
