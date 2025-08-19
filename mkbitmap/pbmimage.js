// Adapted from https://github.com/megawac/pbm-formatter
const PBMImage = function (data) {
  var exp = /^(\S+)\s+(\#.*?\n)*\s*(\d+)\s+(\d+)\s+(\d+)?\s*/,
    match = data.match(exp);

  if (match) {
    var width = (this.width = parseInt(match[3], 10)),
      height = (this.height = parseInt(match[4], 10)),
      maxVal = parseInt(match[5], 10),
      bytes = maxVal < 256 ? 1 : 2,
      data = data.substr(match[0].length),
      magicNumber = match[1];

    switch (magicNumber) {
      case 'P4':
        this._parser = new BinaryParser(data, bytes);
        this._formatter = new PBMFormatter(width, height);
        break;

      default:
        throw new TypeError('File format is not supported. [' + match[1] + ']');
        return false;
    }
  } else {
    throw new TypeError('File does not appear to be a Netpbm file.');
    return false;
  }
};

PBMImage.prototype.getImageData = function () {
  return this._formatter.getImageData(this._parser);
};

const BinaryParser = function (data, bytes) {
  this._data = data;
  this._bytes = bytes;
  this._pointer = 0;
};

BinaryParser.prototype.getNextSample = function () {
  if (this._pointer >= this._data.length) return false;

  var val = 0;
  for (var i = 0; i < this._bytes; i++) {
    val = val * 255 + this._data.charCodeAt(this._pointer++);
  }

  return val;
};

const ASCIIParser = function (data, bytes) {
  this._data = data.split(/\s+/);
  this._bytes = bytes;
  this._pointer = 0;
};

ASCIIParser.prototype.getNextSample = function () {
  if (this._pointer >= this._data.length) return false;

  var val = 0;
  for (var i = 0; i < this._bytes; i++) {
    val = val * 255 + parseInt(this._data[this._pointer++], 10);
  }

  return val;
};

const PBMFormatter = function (width, height) {
  this._width = width;
  this._height = height;
};

PBMFormatter.prototype.getImageData = function (parser) {
  var img;

  if (parser instanceof BinaryParser) {
    var data = '',
      byte,
      bytesPerLine = Math.ceil(this._width / 8);

    for (var i = 0; i < this._height; i++) {
      var line = parser._data.substr(i * bytesPerLine, bytesPerLine),
        lineData = '';

      for (var j = 0; j < line.length; j++)
        lineData += ('0000000' + line.charCodeAt(j).toString(2)).substr(-8);
      data += lineData.substr(0, this._width);
    }

    while ((byte = parser.getNextSample()) !== false) {
      data += ('0000000' + byte.toString(2)).substr(-8);
    }

    parser = new ASCIIParser(data.split('').join(' '), 1);
  }

  img = new ImageData(this._width, this._height);

  for (var row = 0; row < this._height; row++) {
    for (var col = 0; col < this._width; col++) {
      var d = (1 - parser.getNextSample()) * 255,
        pos = (row * this._width + col) * 4;
      img.data[pos] = d;
      img.data[pos + 1] = d;
      img.data[pos + 2] = d;
      img.data[pos + 3] = 255;
    }
  }

  return img;
};

export default PBMImage;
