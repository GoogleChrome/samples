fetch('users.html').then(function(response) {
  return response.text();
}).then(function(body) {
  ChromeSamples.log(body);
});
