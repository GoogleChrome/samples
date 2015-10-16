function makeRequest(url) {
  fetch(url).then(function(response) {
    // Shorthand to check for an HTTP 2xx response status.
    // See https://fetch.spec.whatwg.org/#dom-response-ok
    if (response.ok) {
      return response;
    }
    // Raise an exception to reject the promise and trigger the outer .catch() handler.
    // By default, an error response status (4xx, 5xx) does NOT cause the promise to reject!
    throw Error(response.statusText);
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    ChromeSamples.log('Request succeeded with JSON response:', json);
  }).catch(function(error) {
    ChromeSamples.log('Request failed:', error.message);
  });
}

makeRequest('notfound.json');
makeRequest('users.json');

