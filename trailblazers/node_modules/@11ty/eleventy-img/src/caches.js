const MemoryCache = require("./memory-cache.js");
const DiskCache = require("./disk-cache.js");
const ExistsCache = require("./exists-cache.js");

let memCache = new MemoryCache();

let existsCache = new ExistsCache();

let diskCache = new DiskCache();
diskCache.setExistsCache(existsCache);

module.exports = {
  memCache,
  diskCache,
  existsCache
};
