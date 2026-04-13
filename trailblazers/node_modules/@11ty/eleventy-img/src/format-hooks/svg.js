const fs = require("node:fs");
const debugUtil = require("debug");
const debugAssets = debugUtil("Eleventy:Assets");

module.exports = async function createSvg(sharpInstance) {
  let input = sharpInstance.options.input;
  let svgBuffer = input.buffer;
  if(svgBuffer) { // remote URL already has buffer
    return svgBuffer;
  } else { // local file system
    debugAssets("[11ty/eleventy-img] Reading %o", input.file);
    return fs.readFileSync(input.file);
  }
};
