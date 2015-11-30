function logLoaded(fontFace) {
  ChromeSamples.log(fontFace.family, 'loaded successfully.');
}

// Loading FontFaces via JavaScript is alternative to using CSS's @font-face rule.
var bitterFontFace = new FontFace('Bitter', 'url(https://fonts.gstatic.com/s/bitter/v7/HEpP8tJXlWaYHimsnXgfCOvvDin1pK8aKteLpeZ5c0A.woff2)');
document.fonts.add(bitterFontFace);
bitterFontFace.loaded.then(logLoaded);
var oxygenFontFace = new FontFace('Oxygen', 'url(https://fonts.gstatic.com/s/oxygen/v5/qBSyz106i5ud7wkBU-FrPevvDin1pK8aKteLpeZ5c0A.woff2)');
document.fonts.add(oxygenFontFace);
oxygenFontFace.loaded.then(logLoaded);

// The .ready promise resolves when all fonts that have been previously requested
// are loaded and layout operations are complete.
document.fonts.ready.then(function() {
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
