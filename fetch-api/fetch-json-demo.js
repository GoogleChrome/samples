fetch('users.json').then(function(response) {
  return response.json();
}).then(function(json) {
  ChromeSamples.log('Parsed JSON from the response:', json);
}).catch(function(ex) {
  ChromeSamples.log('Parsing failed:', ex);
});
