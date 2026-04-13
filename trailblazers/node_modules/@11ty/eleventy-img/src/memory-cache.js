const debug = require("debug")("Eleventy:Image");

class MemoryCache {
  constructor() {
    this.cache = {};
    this.hitCounter = 0;
    this.missCounter = 0;
  }

  resetCount() {
    this.hitCounter = 0;
    this.missCounter = 0;
  }

  getCount() {
    return [this.hitCounter, this.missCounter];
  }

  add(key, results) {
    this.cache[key] = {
      results
    };

    debug("Unique images processed: %o", this.size());
  }

  get(key, incrementCounts = false) {
    if(this.cache[key]) {
      if(incrementCounts) {
        this.hitCounter++;
      }
      // debug("Images re-used (via in-memory cache): %o", this.hitCounter);

      // may return promise
      return this.cache[key].results;
    }

    if(incrementCounts) {
      this.missCounter++;
    }

    return false;
  }

  has(key) {
    return key in this.cache;
  }

  size() {
    return Object.keys(this.cache).length;
  }
}

module.exports = MemoryCache;
