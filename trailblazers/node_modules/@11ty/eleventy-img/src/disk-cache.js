// const debug = require("debug")("Eleventy:Image");

class DiskCache {
  #existsCache;

  constructor() {
    this.hitCounter = 0;
    this.missCounter = 0;
    this.inputs = new Map();
  }

  setExistsCache(existsCache) {
    this.#existsCache = existsCache;
  }

  resetCount() {
    this.hitCounter = 0;
    this.missCounter = 0;
  }

  getCount() {
    return [this.hitCounter, this.missCounter];
  }

  isCached(targetFile, sourceInput, incrementCounts = true) {
    if(!this.#existsCache) {
      throw new Error("Missing `#existsCache`");
    }

    // Disk cache runs once per output file, so we only increment counts once per input
    if(this.inputs.has(sourceInput)) {
      incrementCounts = false;
    }

    this.inputs.set(sourceInput, true);

    if(this.#existsCache?.exists(targetFile)) {
      if(incrementCounts) {
        this.hitCounter++;
      }

      // debug("Images re-used (via disk cache): %o", this.hitCounter);
      return true;
    }

    if(incrementCounts) {
      this.missCounter++;
    }

    return false;
  }
}

module.exports = DiskCache;
