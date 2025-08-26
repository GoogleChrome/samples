// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const fs = require('fs');
const filePath = __dirname + "/views/index.html";


// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.use((req, res, next) => {
  // res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  // res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  console.log(JSON.stringify(request.headers));
  const fileContent = fs.readFileSync(filePath, 'utf8');
  var newContent = fileContent.replace("\"__HEADERS__\"", JSON.stringify(request.headers));
  // response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  response.send(newContent);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
