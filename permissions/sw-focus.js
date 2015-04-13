self.onmessage = function(event) {
  console.log('message received ' + event);
  self.clients.getAll().then(function(c) {
    console.log(c);
    c[0].focus();
  });
};

console.log('foobar');
