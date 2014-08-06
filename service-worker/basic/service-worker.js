self.onfetch = function(event) {
  console.log('got a request');

  var salutation = 'Hello, ';
  var whom = decodeURIComponent(event.request.url.match(/\/([^/]*)$/)[1]);
  var energy_level = (whom == 'Cleveland')
      ? '!!!' // take it up to 11
      : '!';
  var version = '\n\n(Version 1)';

  var body = new Blob([salutation, whom, energy_level, version]);

  event.respondWith(new Response(body));
};
