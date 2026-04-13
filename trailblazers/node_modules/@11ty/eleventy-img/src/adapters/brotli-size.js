const brotliSize = require("brotli-size");

module.exports = function(contents) {
  return brotliSize.sync(contents);
};
