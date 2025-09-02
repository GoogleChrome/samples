const express = require("express");
const app = express();

const getHTML = (prefersColorScheme) => `
<!DOCTYPE html>
<html lang="en">
  <head>
	  <meta charset="utf-8">
	  <title>Sec-CH-Prefers-Color-Scheme Demo</title>
	  <style>
      body {
        font-family: system-ui, sans-serif;
        background-image: ${prefersColorScheme === 'dark' ? `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(68,68,68,1) 100%);`  : `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(204,204,204,1) 100%);`}
      }
      p,
      pre {
        color: ${prefersColorScheme === 'dark' ? 'white' : 'black'}
      }
      a {
        color: ${prefersColorScheme === 'dark' ? 'yellow' : 'blue'}
      }
    </style>
  </head>
  <body>
    <pre>Sec-CH-Prefers-Color-Scheme: ${prefersColorScheme}</pre>
    <p${prefersColorScheme === undefined ? ' hidden' : ''}>
      Toggle your operating system's preferred color scheme and examine via DevTools how the inlined CSS changes.
    </p>
    <p>
      For more details, visit the
      <a href="https://github.com/wicg/user-preference-media-features-headers">User Preference Media Features Client Hints Headers</a>
      repository.
    </p>
  </body>
</html>
`;


app.get("/", (req, res) => {
  res.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme");
  res.set("Vary", "Sec-CH-Prefers-Color-Scheme");
  res.set("Critical-CH", "Sec-CH-Prefers-Color-Scheme");

  const prefersColorScheme = req.get("sec-ch-prefers-color-scheme");
  res.send(getHTML(prefersColorScheme));
});

app.get("/no-critical-ch", (req, res) => {
  res.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme");
  res.set("Vary", "Sec-CH-Prefers-Color-Scheme");
  // res.set("Critical-CH", "Sec-CH-Prefers-Color-Scheme");

  const prefersColorScheme = req.get("sec-ch-prefers-color-scheme");
  res.send(getHTML(prefersColorScheme));
});

app.listen(process.env.PORT || 3500);
