document.querySelector('#report-validity').addEventListener('click', function() {
  var isValid = document.querySelector('#sample-form').reportValidity();
  ChromeSamples.setStatus('The form ' + (isValid ? 'is' : 'is not') + ' valid.');
});
