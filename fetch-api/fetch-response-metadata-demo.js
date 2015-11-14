fetch('users.json').then(function(response) {
  ChromeSamples.log('Status:', response.status);
  ChromeSamples.log('Status Text:', response.statusText);
  ChromeSamples.log('Response Type:', response.type);
  ChromeSamples.log('Request URL:', response.url);
  ChromeSamples.log('Content-Type: ' + response.headers.get('Content-Type'));
  ChromeSamples.log('Date: ' + response.headers.get('Date'));
});
