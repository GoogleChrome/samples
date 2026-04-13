const fs = require("node:fs");
const debugAssets = require("debug")("Eleventy:Assets");

class DirectoryManager {
  #dirs = new Set();

  isCreated(dir) {
    return this.#dirs.has(dir);
  }

  create(dir) {
    if(this.isCreated(dir)) {
      return;
    }

    this.#dirs.add(dir);
    debugAssets("Creating directory %o", dir);
    fs.mkdirSync(dir, { recursive: true });
  }
}

module.exports = DirectoryManager;
