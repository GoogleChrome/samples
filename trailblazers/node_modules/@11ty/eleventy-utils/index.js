const TemplatePath = require("./src/TemplatePath.js");
const isPlainObject = require("./src/IsPlainObject.js");
const Merge = require("./src/Merge.js");
const DateCompare = require("./src/DateCompare.js");
const { DeepCopy } = Merge;
const { createHash, createHashHex, createHashSync, createHashHexSync } = require("./src/CreateHash.js");
const Buffer = require("./src/Buffer.js");

module.exports = {
  TemplatePath,
  isPlainObject,
  Merge,
  DeepCopy,
  DateCompare,
  createHash,
  createHashHex,
  createHashSync,
  createHashHexSync,
  Buffer,
};