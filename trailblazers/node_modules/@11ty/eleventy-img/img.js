const {default: PQueue} = require("p-queue");

const DeferCounter = require("./src/defer-counter.js");
const BuildLogger = require("./src/build-logger.js");
const Util = require("./src/util.js");
const Image = require("./src/image.js");
const DirectoryManager = require("./src/directory-manager.js");

// For exports
const getImageSize = require("image-size");
const ImagePath = require("./src/image-path.js");

const debug = require("debug")("Eleventy:Image");

const GLOBAL_OPTIONS = require("./src/global-options.js").defaults;

const { memCache, diskCache } = require("./src/caches.js");

let deferCounter = new DeferCounter();
let buildLogger = new BuildLogger();
let directoryManager = new DirectoryManager();

/* Queue */
let processingQueue = new PQueue({
  concurrency: GLOBAL_OPTIONS.concurrency
});
processingQueue.on("active", () => {
  debug( `Concurrency: ${processingQueue.concurrency}, Size: ${processingQueue.size}, Pending: ${processingQueue.pending}` );
});

// TODO move this into build-logger.js
function setupLogger(eleventyConfig, opts) {
  if(typeof eleventyConfig?.logger?.logWithOptions !== "function" || Util.isRequested(opts?.generatedVia)) {
    return;
  }

  buildLogger.setupOnce(eleventyConfig, () => {
    // before build
    deferCounter.resetCount();
    memCache.resetCount();
    diskCache.resetCount();
  }, () => {
    // after build
    let [memoryCacheHit] = memCache.getCount();
    let [diskCacheHit, diskCacheMiss] = diskCache.getCount();
    // these are unique images, multiple requests to optimize the same image are de-duplicated
    let deferCount = deferCounter.getCount();

    let cachedCount = memoryCacheHit + diskCacheHit;
    let optimizedCount = diskCacheMiss + diskCacheHit + memoryCacheHit + deferCount;

    let msg = [];
    msg.push(`${optimizedCount} ${optimizedCount !== 1 ? "images" : "image"} optimized`);

    if(cachedCount > 0 || deferCount > 0) {
      let innerMsg = [];
      if(cachedCount > 0) {
        innerMsg.push(`${cachedCount} cached`);
      }
      if(deferCount > 0) {
        innerMsg.push(`${deferCount} deferred`);
      }
      msg.push(` (${innerMsg.join(", ")})`);
    }

    if(optimizedCount > 0 || cachedCount > 0 || deferCount > 0) {
      eleventyConfig?.logger?.logWithOptions({
        message: msg.join(""),
        prefix: "[11ty/eleventy-img]",
        color: "green",
      });
    }
  });
}

function createImage(src, opts = {}) {
  let eleventyConfig = opts.eleventyConfig;

  if(opts?.eleventyConfig && {}.propertyIsEnumerable.call(opts, "eleventyConfig")) {
    delete opts.eleventyConfig;
    Util.addConfig(eleventyConfig, opts);
  }

  let img = Image.create(src, opts);

  img.setQueue(processingQueue);
  img.setBuildLogger(buildLogger);
  img.setDirectoryManager(directoryManager);

  setupLogger(eleventyConfig, opts);

  if(opts.transformOnRequest) {
    deferCounter.increment(src);
  }

  return img;
};

function queueImage(src, opts = {}) {
  if(src.constructor?.name === "UserConfig") {
    throw new Error(`Eleventy Image’s default export is not an Eleventy Plugin and cannot be used with \`eleventyConfig.addPlugin()\`. Use the \`eleventyImageTransformPlugin\` named export instead, like this: \`import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';\` or this: \`const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');\``);
  }

  let img = createImage(src, opts);
  return img.queue();
}

// Exports

module.exports = queueImage;

Object.defineProperty(module.exports, "concurrency", {
  get: function() {
    return processingQueue.concurrency;
  },
  set: function(concurrency) {
    processingQueue.concurrency = concurrency;
  },
});

module.exports.Util = Util;
module.exports.Image = Image;
module.exports.ImagePath = ImagePath;
module.exports.ImageSize = getImageSize;

// Backwards compat
module.exports.statsSync = Image.statsSync;
module.exports.statsByDimensionsSync = Image.statsByDimensionsSync;
module.exports.getFormats = Image.getFormatsArray;
module.exports.getWidths = Image.getValidWidths;

module.exports.getHash = function getHash(src, options) {
  let img = new Image(src, options);
  return img.getHash();
};

module.exports.setupLogger = setupLogger;

const generateHTML = require("./src/generate-html.js");
module.exports.generateHTML = generateHTML;
module.exports.generateObject = generateHTML.generateObject;

const { eleventyWebcOptionsPlugin } = require("./src/webc-options-plugin.js");
module.exports.eleventyImagePlugin = eleventyWebcOptionsPlugin;
module.exports.eleventyImageWebcOptionsPlugin = eleventyWebcOptionsPlugin;

const { eleventyImageTransformPlugin } = require("./src/transform-plugin.js");
module.exports.eleventyImageTransformPlugin = eleventyImageTransformPlugin;

const { eleventyImageOnRequestDuringServePlugin } = require("./src/on-request-during-serve-plugin.js");
module.exports.eleventyImageOnRequestDuringServePlugin = eleventyImageOnRequestDuringServePlugin;
