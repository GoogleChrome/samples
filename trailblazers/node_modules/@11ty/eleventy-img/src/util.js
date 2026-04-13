const path = require("node:path");

class Util {
  static KEYS = {
    requested: "requested"
  };

  /*
   * Does not mutate, returns new Object.
   */
  static getSortedObject(unordered) {
    let keys = Object.keys(unordered).sort();
    let obj = {};
    for(let key of keys) {
      obj[key] = unordered[key];
    }
    return obj;
  }

  static isRemoteUrl(url) {
    try {
      const validUrl = new URL(url);

      if (validUrl.protocol.startsWith("https:") || validUrl.protocol.startsWith("http:")) {
        return true;
      }

      return false;
    // eslint-disable-next-line no-unused-vars
    } catch(e) {
      // invalid url OR local path
      return false;
    }
  }

  static normalizeImageSource({ input, inputPath }, src, options = {}) {
    let { isViaHtml } = Object.assign({
      isViaHtml: false
    }, options);

    if(Util.isFullUrl(src)) {
      return src;
    }

    if(isViaHtml) {
      src = decodeURIComponent(src);
    }

    if(!path.isAbsolute(src)) {
      // if the image src is relative, make it relative to the template file (inputPath);
      let dir = path.dirname(inputPath);
      return path.join(dir, src);
    }

    // if the image src is absolute, make it relative to the input/content directory.
    return path.join(input, src);
  }

  static isRequested(generatedVia) {
    return generatedVia === this.KEYS.requested;
  }

  static addConfig(eleventyConfig, options) {
    if(!eleventyConfig) {
      return;
    }

    Object.defineProperty(options, "eleventyConfig", {
      value: eleventyConfig,
      enumerable: false,
    });
  }
}

// Temporary alias for changes made in https://github.com/11ty/eleventy-img/pull/138
Util.isFullUrl = Util.isRemoteUrl;

module.exports = Util;
