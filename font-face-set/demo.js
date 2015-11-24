// Load Bitter via JavaScript, as an alternative to CSS's @font-face rule.
var bitterFontFace = new FontFace('Bitter', 'url(https://fonts.gstatic.com/s/bitter/v7/HEpP8tJXlWaYHimsnXgfCOvvDin1pK8aKteLpeZ5c0A.woff2)');
document.fonts.add(bitterFontFace);

// The .ready promise resolves when all fonts that have been previously requested
// are loaded and layout operations are complete.
document.fonts.ready.then(function() {
  // Our CSS sets visibility: hidden on the oxygen class initially,
  // so let's make it visible now.
  // This technique avoids displaying text until the font it requires is loaded.
  // An alternative approach is used with the text styled with the bitter class,
  // which is visible from the start using the default font,
  // and then switches to the custom Bitter font once that's loaded.
  document.querySelector('.oxygen').style.visibility = 'visible';

  ChromeSamples.log('There are', document.fonts.size, 'FontFaces loaded.\n');

  // document.fonts has a Set-like interface. Here, we're iterating over its values.
  for (var fontFace of document.fonts.values()) {
    ChromeSamples.log('FontFace:');
    for (var property in fontFace) {
      ChromeSamples.log('  ' + property + ': ' + fontFace[property]);
    }
    ChromeSamples.log('\n');
  }
});
