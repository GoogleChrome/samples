const path = require("node:path");
const os = require("node:os");

const Util = require("./util.js");
const svgHook = require("./format-hooks/svg.js");

const DEFAULTS = {
  widths: ["auto"],
  formats: ["webp", "jpeg"], // "png", "svg", "avif"

  formatFiltering: ["transparent", "animated"],

  // Via https://github.com/11ty/eleventy-img/issues/258
  concurrency: Math.min(Math.max(8, os.availableParallelism()), 16),

  urlPath: "/img/",
  outputDir: "img/",

  // true to skip raster formats if SVG input is found
  // "size" to skip raster formats if larger than SVG input
  svgShortCircuit: false,
  svgAllowUpscale: true,
  svgCompressionSize: "", // "br" to report SVG `size` property in metadata as Brotli compressed
  // overrideInputFormat: false, // internal, used to force svg output in statsSync et al
  sharpOptions: {}, // options passed to the Sharp constructor
  sharpWebpOptions: {}, // options passed to the Sharp webp output method
  sharpPngOptions: {}, // options passed to the Sharp png output method
  sharpJpegOptions: {}, // options passed to the Sharp jpeg output method
  sharpAvifOptions: {}, // options passed to the Sharp avif output method

  formatHooks: {
    svg: svgHook,
  },

  cacheDuration: "1d", // deprecated, use cacheOptions.duration

  // disk cache for remote assets
  cacheOptions: {
    // duration: "1d",
    // directory: ".cache",
    // removeUrlQueryParams: false,
    // fetchOptions: {},
  },

  filenameFormat: null,

  // urlFormat allows you to return a full URL to an image including the domain.
  // Useful when you’re using your own hosted image service (probably via .statsSync or .statsByDimensionsSync)
  // Note: when you use this, metadata will not include .filename or .outputPath
  urlFormat: null,

  // If true, skips all image processing, just return stats. Doesn’t read files, doesn’t write files.
  // Important to note that `dryRun: true` performs image processing and includes a buffer—this does not.
  // Useful when used with `urlFormat` above.
  // Better than .statsSync* functions, because this will use the in-memory cache and de-dupe requests. Those will not.
  statsOnly: false,
  remoteImageMetadata: {}, // For `statsOnly` remote images, this needs to be populated with { width, height, format? }

  useCache: true, // in-memory and disk cache
  dryRun: false, // Also returns a buffer instance in the return object. Doesn’t write anything to the file system

  hashLength: 10, // Truncates the hash to this length

  fixOrientation: false, // always rotate images to ensure correct orientation

  // When the original width is smaller than the desired output width, this is the minimum size difference
  // between the next smallest image width that will generate one extra width in the output.
  // e.g. when using `widths: [400, 800]`, the source image would need to be at least (400 * 1.25 =) 500px wide
  // to generate two outputs (400px, 500px). If the source image is less than 500px, only one output will
  // be generated (400px).
  // Read more at https://github.com/11ty/eleventy-img/issues/184 and https://github.com/11ty/eleventy-img/pull/190
  minimumThreshold: 1.25,

  // During --serve mode in Eleventy, this will generate images on request instead of part of the build skipping
  // writes to the file system and speeding up builds!
  transformOnRequest: false,

  // operate on Sharp instance manually.
  transform: undefined,

  // return HTML from generateHTML directly
  returnType: "object", // or "html"

  // Defaults used when generateHTML is called from a result set
  htmlOptions: {
    imgAttributes: {},
    pictureAttributes: {},

    whitespaceMode: "inline", // "block"

    // the <img> will use the largest dimensions for width/height (when multiple output widths are specified)
    // see https://github.com/11ty/eleventy-img/issues/63
    fallback: "largest", // or "smallest"
  },

  // v5.0.0 Removed `extensions`, option to override output format with new file extension. It wasn’t being used anywhere or documented.
  // v6.0.0, removed `useCacheValidityInHash: true` see https://github.com/11ty/eleventy-img/issues/146#issuecomment-2555741376
};

function getGlobalOptions(eleventyConfig, options, via) {
  let directories = eleventyConfig.directories;
  let globalOptions = Object.assign({
    packages: {
      image: require("../"),
    },
    outputDir: path.join(directories.output, options.urlPath || ""),
    failOnError: true,
  }, options);

  globalOptions.directories = directories;
  globalOptions.generatedVia = via;

  Util.addConfig(eleventyConfig, globalOptions);

  return globalOptions;
}

module.exports = {
  getGlobalOptions,
  defaults: DEFAULTS,
};
