if ('TextDecoder' in window) {
  // The local files to be fetched, mapped to the encoding that they're using.
  var filesToEncoding = {
    'utf8.bin': 'utf-8',
    'utf16le.bin': 'utf-16le',
    'macintosh.bin': 'macintosh'
  };

  Object.keys(filesToEncoding).forEach(function(file) {
    fetchAndDecode(file, filesToEncoding[file]);
  });
} else {
  ChromeSamples.setStatus('Your browser does not support the Encoding API.');
}

// Use XHR to fetch `file` and interpret its contents as being encoded with `encoding`.
function fetchAndDecode(file, encoding) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', file);
  // Using 'arraybuffer' as the responseType ensures that the raw data is returned,
  // rather than letting XMLHttpRequest decode the data first.
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    if (this.status === 200) {
      // The decode() method takes a DataView as a parameter, which is a wrapper on top of the ArrayBuffer.
      var dataView = new DataView(this.response);
      // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
      var decoder = new TextDecoder(encoding);
      var decodedString = decoder.decode(dataView);
      ChromeSamples.log(decodedString);
    } else {
      ChromeSamples.setStatus('Error while requesting', file, this.status);
    }
  };
  xhr.send();
}
