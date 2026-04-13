const path = require("node:path");

class ImagePath {
  static filenameFormat(id, src, width, format) { // and options
    if (width) {
      return `${id}-${width}.${format}`;
    }

    return `${id}.${format}`;
  }

  static getFilename(id, src, width, format, options = {}) {
    if (typeof options.filenameFormat === "function") {
      let filename = options.filenameFormat(id, src, width, format, options);
      // if options.filenameFormat returns falsy, use fallback filename
      if(filename) {
        return filename;
      }
    }

    return ImagePath.filenameFormat(id, src, width, format, options);
  }

  static convertFilePathToUrl(dir, filename) {
    let src = path.join(dir, filename);
    return src.split(path.sep).join("/");
  }
}

module.exports = ImagePath;
