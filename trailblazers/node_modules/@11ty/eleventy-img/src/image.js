const fs = require("node:fs");
const fsp = fs.promises;
const path = require("node:path");
const getImageSize = require("image-size");
const debugUtil = require("debug");

const { createHashSync } = require("@11ty/eleventy-utils");
const { Fetch } = require("@11ty/eleventy-fetch");

const sharp = require("./adapters/sharp.js");
const brotliSize = require("./adapters/brotli-size.js");
const Util = require("./util.js");
const ImagePath = require("./image-path.js");
const generateHTML = require("./generate-html.js");

const GLOBAL_OPTIONS = require("./global-options.js").defaults;
const { existsCache, memCache, diskCache } = require("./caches.js");

const debug = debugUtil("Eleventy:Image");
const debugAssets = debugUtil("Eleventy:Assets");

const MIME_TYPES = {
  "jpeg": "image/jpeg",
  "webp": "image/webp",
  "png": "image/png",
  "svg": "image/svg+xml",
  "avif": "image/avif",
  "gif": "image/gif",
};

const FORMAT_ALIASES = {
  "jpg": "jpeg",
  // if you’re working from a mime type input, let’s alias it back to svg
  "svg+xml": "svg",
};

const ANIMATED_TYPES = [
  "webp",
  "gif",
];

const TRANSPARENCY_TYPES = [
  "avif",
  "png",
  "webp",
  "gif",
  "svg",
];

const MINIMUM_TRANSPARENCY_TYPES = [
  "png",
  "gif",
  "svg",
];

class Image {
  #input;
  #contents = {};
  #queue;
  #queuePromise;
  #buildLogger;
  #computedHash;
  #directoryManager;

  constructor(src, options = {}) {
    if(!src) {
      throw new Error("`src` is a required argument to the eleventy-img utility (can be a String file path, String URL, or Buffer).");
    }

    this.src = src;
    this.isRemoteUrl = typeof src === "string" && Util.isRemoteUrl(src);

    this.rawOptions = options;
    this.options = Object.assign({}, GLOBAL_OPTIONS, options);

    // Compatible with eleventy-dev-server and Eleventy 3.0.0-alpha.7+ in serve mode.
    if(this.options.transformOnRequest && !this.options.urlFormat) {
      this.options.urlFormat = function({ src, width, format }/*, imageOptions*/, options) {
        return `/.11ty/image/?src=${encodeURIComponent(src)}&width=${width}&format=${format}${options.generatedVia ? `&via=${options.generatedVia}` : ""}`;
      };

      this.options.statsOnly = true;
    }

    if(this.isRemoteUrl) {
      this.cacheOptions = Object.assign({
        type: "buffer",
        // deprecated in Eleventy Image, but we already prefer this.cacheOptions.duration automatically
        duration: this.options.cacheDuration,
        // Issue #117: re-use eleventy-img dryRun option value for eleventy-fetch dryRun
        dryRun: this.options.dryRun,
      }, this.options.cacheOptions);

      // v6.0.0 this now inherits eleventy-fetch option defaults
      this.assetCache = Fetch(src, this.cacheOptions);
    }
  }

  setQueue(queue) {
    this.#queue = queue;
  }

  setBuildLogger(buildLogger) {
    this.#buildLogger = buildLogger;
  }

  setDirectoryManager(manager) {
    this.#directoryManager = manager;
  }

  get directoryManager() {
    if(!this.#directoryManager) {
      throw new Error("Missing #directoryManager");
    }

    return this.#directoryManager;
  }

  get buildLogger() {
    if(!this.#buildLogger) {
      throw new Error("Missing #buildLogger. Call `setBuildLogger`");
    }
    return this.#buildLogger;
  }

  // In memory cache is up front, handles promise de-duping from input (this does not use getHash)
  // Note: output cache is also in play below (uses getHash)
  getInMemoryCacheKey() {
    let opts = Util.getSortedObject(this.options);

    opts.__originalSrc = this.src;

    if(this.isRemoteUrl) {
      opts.sourceUrl = this.src; // the source url
    } else if(Buffer.isBuffer(this.src)) {
      opts.sourceUrl = this.src.toString();
      opts.__originalSize = this.src.length;
    } else {
      // Important: do not cache this
      opts.__originalSize = fs.statSync(this.src).size;
    }

    return JSON.stringify(opts, function(key, value) {
      // allows `transform` functions to be truthy for in-memory key
      if (typeof value === "function") {
        return "<fn>" + (value.name || "");
      }
      return value;
    });
  }

  getFileContents(overrideLocalFilePath) {
    if(!overrideLocalFilePath && this.isRemoteUrl) {
      return false;
    }

    let src = overrideLocalFilePath || this.src;

    if(!this.#contents[src]) {
      // perf: check to make sure it’s not a string first
      if(typeof src !== "string" && Buffer.isBuffer(src)) {
        this.#contents[src] = src;
      } else {
        debugAssets("[11ty/eleventy-img] Reading %o", src);
        this.#contents[src] = fs.readFileSync(src);
      }
    }

    // Always <Buffer>
    return this.#contents[src];
  }

  static getValidWidths(originalWidth, widths = [], allowUpscale = false, minimumThreshold = 1) {
    // replace any falsy values with the original width
    let valid = widths.map(width => !width || width === 'auto' ? originalWidth : width);

    // Convert strings to numbers, "400" (floats are not allowed in sharp)
    valid = valid.map(width => parseInt(width, 10));

    // Replace any larger-than-original widths with the original width if upscaling is not allowed.
    // This ensures that if a larger width has been requested, we're at least providing the closest
    // non-upscaled image that we can.
    if (!allowUpscale) {
      let lastWidthWasBigEnough = true; // first one is always valid
      valid = valid.sort((a, b) => a - b).map(width => {
        if(width > originalWidth) {
          if(lastWidthWasBigEnough) {
            return originalWidth;
          }
          return -1;
        }

        lastWidthWasBigEnough = originalWidth > Math.floor(width * minimumThreshold);

        return width;
      }).filter(width => width > 0);
    }

    // Remove duplicates (e.g., if null happens to coincide with an explicit width
    // or a user passes in multiple duplicate values, or multiple larger-than-original
    // widths have resulted in the original width being included multiple times)
    valid = [...new Set(valid)];

    // sort ascending
    return valid.sort((a, b) => a - b);
  }

  static getFormatsArray(formats, autoFormat, svgShortCircuit, isAnimated, hasTransparency) {
    if(formats && formats.length) {
      if(typeof formats === "string") {
        formats = formats.split(",");
      }

      formats = formats.map(format => {
        if(autoFormat) {
          if((!format || format === "auto")) {
            format = autoFormat;
          }
        }

        if(FORMAT_ALIASES[format]) {
          return FORMAT_ALIASES[format];
        }
        return format;
      });

      if(svgShortCircuit !== "size") {
        // svg must come first for possible short circuiting
        formats.sort((a, b) => {
          if(a === "svg") {
            return -1;
          } else if(b === "svg") {
            return 1;
          }
          return 0;
        });
      }

      if(isAnimated) {
        let validAnimatedFormats = formats.filter(f => ANIMATED_TYPES.includes(f));
        // override formats if a valid animated format is found, otherwise leave as-is
        if(validAnimatedFormats.length > 0) {
          debug("Filtering non-animated formats from output: from %o to %o", formats, validAnimatedFormats);
          formats = validAnimatedFormats;
        } else {
          debug("No animated output formats found for animated image, using original formats (may be a static image): %o", formats);
        }
      }

      if(hasTransparency) {
        let minimumValidTransparencyFormats = formats.filter(f => MINIMUM_TRANSPARENCY_TYPES.includes(f));
        // override formats if a valid animated format is found, otherwise leave as-is
        if(minimumValidTransparencyFormats.length > 0) {
          let validTransparencyFormats = formats.filter(f => TRANSPARENCY_TYPES.includes(f));
          debug("Filtering non-transparency-friendly formats from output: from %o to %o", formats, validTransparencyFormats);
          formats = validTransparencyFormats;
        } else {
          debug("At least one transparency-friendly output format of %o must be included if the source image has an alpha channel, skipping formatFiltering and using original formats: %o", MINIMUM_TRANSPARENCY_TYPES, formats);
        }
      }

      // Remove duplicates (e.g., if null happens to coincide with an explicit format
      // or a user passes in multiple duplicate values)
      formats = [...new Set(formats)];

      return formats;
    }

    return [];
  }

  #transformRawFiles(files = []) {
    let byType = {};
    for(let file of files) {
      if(!byType[file.format]) {
        byType[file.format] = [];
      }
      byType[file.format].push(file);
    }
    for(let type in byType) {
      // sort by width, ascending (for `srcset`)
      byType[type].sort((a, b) => {
        return a.width - b.width;
      });
    }

    let filterLargeRasterImages = this.options.svgShortCircuit === "size";
    let svgEntry = byType.svg;
    let svgSize = svgEntry && svgEntry.length && svgEntry[0].size;

    if(filterLargeRasterImages && svgSize) {
      for(let type of Object.keys(byType)) {
        if(type === "svg") {
          continue;
        }

        let svgAdded = false;
        let originalFormatKept = false;
        byType[type] = byType[type].map(entry => {
          if(entry.size > svgSize) {
            if(!svgAdded) {
              svgAdded = true;
              // need at least one raster smaller than SVG to do this trick
              if(originalFormatKept) {
                return svgEntry[0];
              }
              // all rasters are bigger
              return false;
            }

            return false;
          }

          originalFormatKept = true;
          return entry;
        }).filter(entry => entry);
      }
    }

    return byType;
  }

  #finalizeResults(results = {}) {
    // used when results are passed to generate HTML, we maintain some internal metadata about the options used.
    let imgAttributes = this.options.htmlOptions?.imgAttributes || {};
    imgAttributes.src = this.src;

    Object.defineProperty(results, "eleventyImage", {
      enumerable: false,
      writable: false,
      value: {
        htmlOptions: {
          whitespaceMode: this.options.htmlOptions?.whitespaceMode,
          imgAttributes,
          pictureAttributes: this.options.htmlOptions?.pictureAttributes,
          fallback: this.options.htmlOptions?.fallback,
        },
      }
    });

    // renamed `return` to `returnType` to match Fetch API in v6.0.0-beta.3
    if(this.options.returnType === "html" || this.options.return === "html") {
      return generateHTML(results);
    }

    return results;
  }

  getSharpOptionsForFormat(format) {
    if(format === "webp") {
      return this.options.sharpWebpOptions;
    } else if(format === "jpeg") {
      return this.options.sharpJpegOptions;
    } else if(format === "png") {
      return this.options.sharpPngOptions;
    } else if(format === "avif") {
      return this.options.sharpAvifOptions;
    }
    return {};
  }

  async getInput() {
    // internal cache
    if(!this.#input) {
      if(this.isRemoteUrl) {
        // fetch remote image Buffer
        this.#input = this.assetCache.queue();
      } else {
        // not actually a promise, this is sync
        this.#input = this.getFileContents();
      }
    }

    return this.#input;
  }

  getHash() {
    if (this.#computedHash) {
      return this.#computedHash;
    }

    // debug("Creating hash for %o", this.src);
    let hashContents = [];

    if(existsCache.exists(this.src)) {
      let fileContents = this.getFileContents();

      // If the file starts with whitespace or the '<' character, it might be SVG.
      // Otherwise, skip the expensive buffer.toString() call
      // (no point in unicode encoding a binary file)
      let fileContentsPrefix = fileContents?.slice(0, 1)?.toString()?.trim();
      if (!fileContentsPrefix || fileContentsPrefix[0] == "<") {
        // remove all newlines for hashing for better cross-OS hash compatibility (Issue #122)
        let fileContentsStr = fileContents.toString();
        let firstFour = fileContentsStr.trim().slice(0, 5);
        if(firstFour === "<svg " || firstFour === "<?xml") {
          fileContents = fileContentsStr.replace(/\r|\n/g, '');
        }
      }

      hashContents.push(fileContents);
    } else {
      // probably a remote URL
      hashContents.push(this.src);

      // `useCacheValidityInHash` was removed in v6.0.0, but we’ll keep this as part of the hash to maintain consistent hashes across versions
      if(this.isRemoteUrl && this.assetCache && this.cacheOptions) {
        hashContents.push(`ValidCache:true`);
      }
    }

    // We ignore all keys not relevant to the file processing/output (including `widths`, which is a suffix added to the filename)
    // e.g. `widths: [300]` and `widths: [300, 600]`, with all else being equal the 300px output of each should have the same hash
    let keysToKeep = [
      "sharpOptions",
      "sharpWebpOptions",
      "sharpPngOptions",
      "sharpJpegOptions",
      "sharpAvifOptions"
    ].sort();

    let hashObject = {};
    // The code currently assumes are keysToKeep are Object literals (see Util.getSortedObject)
    for(let key of keysToKeep) {
      if(this.options[key]) {
        hashObject[key] = Util.getSortedObject(this.options[key]);
      }
    }

    hashContents.push(JSON.stringify(hashObject));

    let base64hash = createHashSync(...hashContents);
    let truncated = base64hash.substring(0, this.options.hashLength);
    this.#computedHash = truncated;
    return truncated;
  }

  getStat(outputFormat, width, height) {
    let url;
    let outputFilename;

    if(this.options.urlFormat && typeof this.options.urlFormat === "function") {
      let hash;
      if(!this.options.statsOnly) {
        hash = this.getHash();
      }

      url = this.options.urlFormat({
        hash,
        src: this.src,
        width,
        format: outputFormat,
      }, this.options);
    } else {
      let hash = this.getHash();
      outputFilename = ImagePath.getFilename(hash, this.src, width, outputFormat, this.options);
      if(Util.isFullUrl(this.options.urlPath)) {
        url = new URL(outputFilename, this.options.urlPath).toString();
      } else {
        url = ImagePath.convertFilePathToUrl(this.options.urlPath, outputFilename);
      }
    }

    let statEntry = {
      format: outputFormat,
      width: width,
      height: height,
      url: url,
      sourceType: MIME_TYPES[outputFormat],
      srcset: `${url} ${width}w`,
      // Not available in stats* functions below
      // size // only after processing
    };

    if(outputFilename) {
      statEntry.filename = outputFilename; // optional
      statEntry.outputPath = path.join(this.options.outputDir, outputFilename); // optional
    }

    return statEntry;
  }

  // https://jdhao.github.io/2019/07/31/image_rotation_exif_info/
  // Orientations 5 to 8 mean image is rotated ±90º (width/height are flipped)
  needsRotation(orientation) {
    // Sharp's metadata API exposes undefined EXIF orientations >8 as 1 (normal) but check anyways
    return orientation >= 5 && orientation <= 8;
  }

  isAnimated(metadata) {
    // sharp options have animated image support enabled
    if(!this.options?.sharpOptions?.animated) {
      return false;
    }

    let isAnimationFriendlyFormat = ANIMATED_TYPES.includes(metadata.format);
    if(!isAnimationFriendlyFormat) {
      return false;
    }

    if(metadata?.pages) {
      // input has multiple pages: https://sharp.pixelplumbing.com/api-input#metadata
      // this is *unknown* when not called from `resize` (limited metadata available)
      return metadata?.pages > 1;
    }

    // Best guess
    return isAnimationFriendlyFormat;
  }

  getEntryFormat(metadata) {
    return metadata.format || this.options.overrideInputFormat;
  }

  // metadata so far: width, height, format
  // src is used to calculate the output file names
  getFullStats(metadata) {
    let results = [];
    let isImageAnimated = this.isAnimated(metadata) && Array.isArray(this.options.formatFiltering) && this.options.formatFiltering.includes("animated");
    let hasAlpha = metadata.hasAlpha && Array.isArray(this.options.formatFiltering) && this.options.formatFiltering.includes("transparent");
    let entryFormat = this.getEntryFormat(metadata);
    let outputFormats = Image.getFormatsArray(this.options.formats, entryFormat, this.options.svgShortCircuit, isImageAnimated, hasAlpha);

    if (this.needsRotation(metadata.orientation)) {
      [metadata.height, metadata.width] = [metadata.width, metadata.height];
    }

    if(metadata.pageHeight) {
      // When the { animated: true } option is provided to sharp, animated
      // image formats like gifs or webp will have an inaccurate `height` value
      // in their metadata which is actually the height of every single frame added together.
      // In these cases, the metadata will contain an additional `pageHeight` property which
      // is the height that the image should be displayed at.
      metadata.height = metadata.pageHeight;
    }

    for(let outputFormat of outputFormats) {
      if(!outputFormat || outputFormat === "auto") {
        throw new Error("When using statsSync or statsByDimensionsSync, `formats: [null | 'auto']` to use the native image format is not supported.");
      }

      if(outputFormat === "svg") {
        if(entryFormat === "svg") {
          let svgStats = this.getStat("svg", metadata.width, metadata.height);

          // SVG metadata.size is only available with Buffer input (remote urls)
          if(metadata.size) {
            // Note this is unfair for comparison with raster formats because its uncompressed (no GZIP, etc)
            svgStats.size = metadata.size;
          }
          results.push(svgStats);

          if(this.options.svgShortCircuit === true) {
            break;
          } else {
            continue;
          }
        } else {
          debug("Skipping SVG output for %o: received raster input.", this.src);
          continue;
        }
      } else { // not outputting SVG (might still be SVG input though!)
        let widths = Image.getValidWidths(metadata.width, this.options.widths, metadata.format === "svg" && this.options.svgAllowUpscale, this.options.minimumThreshold);
        for(let width of widths) {
          let height = Image.getAspectRatioHeight(metadata, width);

          results.push(this.getStat(outputFormat, width, height));
        }
      }
    }

    return this.#transformRawFiles(results);
  }

  static getDimensionsFromSharp(sharpInstance, stat) {
    let dims = {};
    if(sharpInstance.options.width > -1) {
      dims.width = sharpInstance.options.width;
      dims.resized = true;
    }
    if(sharpInstance.options.height > -1) {
      dims.height = sharpInstance.options.height;
      dims.resized = true;
    }

    if(dims.width || dims.height) {
      if(!dims.width) {
        dims.width = Image.getAspectRatioWidth(stat, dims.height);
      }
      if(!dims.height) {
        dims.height = Image.getAspectRatioHeight(stat, dims.width);
      }
    }

    return dims;
  }

  static getAspectRatioWidth(originalDimensions, newHeight) {
    return Math.floor(newHeight * originalDimensions.width / originalDimensions.height);
  }

  static getAspectRatioHeight(originalDimensions, newWidth) {
    // Warning: if this is a guess via statsByDimensionsSync and that guess is wrong
    // The aspect ratio will be wrong and any height/widths returned will be wrong!
    return Math.floor(newWidth * originalDimensions.height / originalDimensions.width);
  }

  getOutputSize(contents, filePath) {
    if(contents) {
      if(this.options.svgCompressionSize === "br") {
        return brotliSize(contents);
      }

      if("length" in contents) {
        return contents.length;
      }
    }

    // fallback to looking on local file system
    if(!filePath) {
      throw new Error("`filePath` expected.");
    }

    return fs.statSync(filePath).size;
  }

  isOutputCached(targetFile, sourceInput) {
    if(!this.options.useCache) {
      return false;
    }

    // last cache was a miss, so we must write to disk
    if(this.assetCache && !this.assetCache.wasLastFetchCacheHit()) {
      return false;
    }

    if(!diskCache.isCached(targetFile, sourceInput, !Util.isRequested(this.options.generatedVia))) {
      return false;
    }

    return true;
  }

  // src should be a file path to an image or a buffer
  async resize(input) {
    let sharpInputImage = sharp(input, Object.assign({
      // Deprecated by sharp, use `failOn` option instead
      // https://github.com/lovell/sharp/blob/1533bf995acda779313fc178d2b9d46791349961/lib/index.d.ts#L915
      failOnError: false,
    }, this.options.sharpOptions));

    // Must find the image format from the metadata
    // File extensions lie or may not be present in the src url!
    let sharpMetadata = await sharpInputImage.metadata();

    let outputFilePromises = [];

    let fullStats = this.getFullStats(sharpMetadata);

    for(let outputFormat in fullStats) {
      for(let stat of fullStats[outputFormat]) {
        if(this.isOutputCached(stat.outputPath, input)) {
          // Cached images already exist in output
          let outputFileContents;

          if(this.options.dryRun || outputFormat === "svg" && this.options.svgCompressionSize === "br") {
            outputFileContents = this.getFileContents(stat.outputPath);
          }

          if(this.options.dryRun) {
            stat.buffer = outputFileContents;
          }

          stat.size = this.getOutputSize(outputFileContents, stat.outputPath);

          outputFilePromises.push(Promise.resolve(stat));
          continue;
        }

        let sharpInstance = sharpInputImage.clone();
        let transform = this.options.transform;
        let isTransformResize = false;

        if(transform) {
          if(typeof transform !== "function") {
            throw new Error("Expected `function` type in `transform` option. Received: " + transform);
          }

          await transform(sharpInstance);

          // Resized in a transform (maybe for a crop)
          let dims = Image.getDimensionsFromSharp(sharpInstance, stat);
          if(dims.resized) {
            isTransformResize = true;

            // Overwrite current `stat` object with new sizes and file names
            stat = this.getStat(stat.format, dims.width, dims.height);
          }
        }

        // https://github.com/11ty/eleventy-img/issues/244
        sharpInstance.keepIccProfile();

        // Output images do not include orientation metadata (https://github.com/11ty/eleventy-img/issues/52)
        // Use sharp.rotate to bake orientation into the image (https://github.com/lovell/sharp/blob/v0.32.6/docs/api-operation.md#rotate):
        // > If no angle is provided, it is determined from the EXIF data. Mirroring is supported and may infer the use of a flip operation.
        // > The use of rotate without an angle will remove the EXIF Orientation tag, if any.
        if(this.options.fixOrientation || this.needsRotation(sharpMetadata.orientation)) {
          sharpInstance.rotate();
        }

        if(!isTransformResize) {
          if(stat.width < sharpMetadata.width || (this.options.svgAllowUpscale && sharpMetadata.format === "svg")) {
            let resizeOptions = {
              width: stat.width
            };

            if(sharpMetadata.format !== "svg" || !this.options.svgAllowUpscale) {
              resizeOptions.withoutEnlargement = true;
            }

            sharpInstance.resize(resizeOptions);
          }
        }

        // Format hooks take priority over Sharp processing.
        // format hooks are only used for SVG out of the box
        if(this.options.formatHooks && this.options.formatHooks[outputFormat]) {
          let hookResult = await this.options.formatHooks[outputFormat].call(stat, sharpInstance);
          if(hookResult) {
            stat.size = this.getOutputSize(hookResult);

            if(this.options.dryRun) {
              stat.buffer = Buffer.from(hookResult);

              outputFilePromises.push(Promise.resolve(stat));
            } else {
              this.directoryManager.createFromFile(stat.outputPath);

              debugAssets("[11ty/eleventy-img] Writing %o", stat.outputPath);

              outputFilePromises.push(fsp.writeFile(stat.outputPath, hookResult).then(() => stat));
            }
          }
        } else { // not a format hook
          let sharpFormatOptions = this.getSharpOptionsForFormat(outputFormat);
          let hasFormatOptions = Object.keys(sharpFormatOptions).length > 0;
          if(hasFormatOptions || outputFormat && sharpMetadata.format !== outputFormat) {
            // https://github.com/lovell/sharp/issues/3680
            // Fix heic regression in sharp 0.33
            if(outputFormat === "heic" && !sharpFormatOptions.compression) {
              sharpFormatOptions.compression = "av1";
            }
            sharpInstance.toFormat(outputFormat, sharpFormatOptions);
          }

          if(!this.options.dryRun && stat.outputPath) {
            // Should never write when dryRun is true
            this.directoryManager.createFromFile(stat.outputPath);

            debugAssets("[11ty/eleventy-img] Writing %o", stat.outputPath);

            outputFilePromises.push(
              sharpInstance.toFile(stat.outputPath)
                .then(info => {
                  stat.size = info.size;
                  return stat;
                })
            );
          } else {
            outputFilePromises.push(sharpInstance.toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
              stat.buffer = data;
              stat.size = info.size;
              return stat;
            }));
          }
        }

        if(stat.outputPath) {
          if(this.options.dryRun) {
            debug( "Generated %o", stat.url );
          } else {
            debug( "Wrote %o", stat.outputPath );
          }
        }
      }
    }

    return Promise.all(outputFilePromises).then(files => this.#finalizeResults(this.#transformRawFiles(files)));
  }

  async getStatsOnly() {
    if(typeof this.src !== "string" || !this.options.statsOnly) {
      return;
    }

    let input;
    if(Util.isRemoteUrl(this.src)) {
      if(this.rawOptions.remoteImageMetadata?.width && this.rawOptions.remoteImageMetadata?.height) {
        return this.getFullStats({
          width: this.rawOptions.remoteImageMetadata.width,
          height: this.rawOptions.remoteImageMetadata.height,
          format: this.rawOptions.remoteImageMetadata.format, // only required if you want to use the "auto" format
          guess: true,
        });
      }

      // Fetch remote image to operate on it
      // `remoteImageMetadata` is no longer required for statsOnly on remote images
      input = await this.getInput();
    }

    // Local images
    try {
      // Related to https://github.com/11ty/eleventy-img/issues/295
      let { width, height, type } = getImageSize(input || this.src);

      return this.getFullStats({
        width,
        height,
        format: type // only required if you want to use the "auto" format
      });
    } catch(e) {
      throw new Error(`Eleventy Image error (statsOnly): \`image-size\` on "${this.src}" failed. Original error: ${e.message}`);
    }
  }

  // returns raw Promise
  queue() {
    if(!this.#queue) {
      return Promise.reject(new Error("Missing #queue."));
    }

    if(this.#queuePromise) {
      return this.#queuePromise;
    }

    debug("Processing %o (in-memory cache miss), options: %o", this.src, this.options);

    this.#queuePromise = this.#queue.add(async () => {
      try {
        if(typeof this.src === "string" && this.options.statsOnly) {
          return this.getStatsOnly();
        }

        this.buildLogger.log(`Processing ${this.buildLogger.getFriendlyImageSource(this.src)}`, this.options);

        let input = await this.getInput();

        return this.resize(input);
      } catch(e) {
        this.buildLogger.error(`Error: ${e.message} (via ${this.buildLogger.getFriendlyImageSource(this.src)})`, this.options);

        if(this.options.failOnError) {
          throw e;
        }
      }
    });

    return this.#queuePromise;
  }

  // Factory to return from cache if available
  static create(src, options = {}) {
    let img = new Image(src, options);

    // use resolved options for this
    if(!img.options.useCache) {
      return img;
    }

    let key = img.getInMemoryCacheKey();
    let cached = memCache.get(key, !options.transformOnRequest && !Util.isRequested(options.generatedVia));
    if(cached) {
      return cached;
    }

    memCache.add(key, img);

    return img;
  }

  /* `statsSync` doesn’t generate any files, but will tell you where
  * the asynchronously generated files will end up! This is useful
  * in synchronous-only template environments where you need the
  * image URLs synchronously but can’t rely on the files being in
  * the correct location yet.
  *
  * `options.dryRun` is still asynchronous but also doesn’t generate
  * any files.
  */
  statsSync() {
    if(this.isRemoteUrl) {
      throw new Error("`statsSync` is not supported with remote sources. Use `statsByDimensionsSync(src, width, height, options)` instead.");
    }

    let dimensions = getImageSize(this.src);

    return this.getFullStats({
      width: dimensions.width,
      height: dimensions.height,
      format: dimensions.type,
    });
  }

  static statsSync(src, opts) {
    if(typeof src === "string" && Util.isRemoteUrl(src)) {
      throw new Error("`statsSync` is not supported with remote sources. Use `statsByDimensionsSync(src, width, height, options)` instead.");
    }

    let img = Image.create(src, opts);
    return img.statsSync();
  }

  statsByDimensionsSync(width, height) {
    let dimensions = {
      width,
      height,
      guess: true
    };
    return this.getFullStats(dimensions);
  }

  static statsByDimensionsSync(src, width, height, opts) {
    let img = Image.create(src, opts);
    return img.statsByDimensionsSync(width, height);
  }
}

module.exports = Image;
