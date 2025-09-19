var express = require('express');
var app = express();

app.all('*', (req, res, next) => {
  if (req.get('X-Forwarded-Proto').includes("https"))
    return next()
  else
    res.redirect('https://' + req.hostname + req.url);
});
app.use(express.static('public'));

exports.saber_tabby_shield = app;
