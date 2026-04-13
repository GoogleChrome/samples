const { escapeAttribute } = require("entities");

const LOWSRC_FORMAT_PREFERENCE = ["jpeg", "png", "gif", "svg", "webp", "avif"];

const CHILDREN_OBJECT_KEY = "@children";

function generateSrcset(metadataFormatEntry) {
  if(!Array.isArray(metadataFormatEntry)) {
    return "";
  }

  return metadataFormatEntry.map(entry => entry.srcset).join(", ");
}

/*
  Returns:
  e.g. { img: { alt: "", src: "" }
  e.g. { img: { alt: "", src: "", srcset: "", sizes: "" } }
  e.g. { picture: {
    class: "",
    @children: [
      { source: { srcset: "", sizes: "" } },
      { source: { srcset: "", sizes: "" } },
      { img: { alt: "", src: "", srcset: "", sizes: "" } },
    ]
  }
 */
function generateObject(metadata, userDefinedImgAttributes = {}, userDefinedPictureAttributes = {}, options = {}) {
  let htmlOptions = options?.htmlOptions || {};
  let imgAttributes = Object.assign({}, options?.defaultAttributes, htmlOptions?.imgAttributes, userDefinedImgAttributes);
  let pictureAttributes = Object.assign({}, htmlOptions?.pictureAttributes, userDefinedPictureAttributes);

  // The attributes.src gets overwritten later on. Save it here to make the error outputs less cryptic.
  let originalSrc = imgAttributes.src;

  if(imgAttributes.alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` attribute on eleventy-img shortcode from: ${originalSrc}`);
  }

  let formats = Object.keys(metadata);
  let values = Object.values(metadata);
  let entryCount = 0;
  for(let imageFormat of values) {
    entryCount += imageFormat.length;
  }

  if(entryCount === 0) {
    throw new Error("No image results found from `eleventy-img` in generateHTML. Expects a results object similar to: https://www.11ty.dev/docs/plugins/image/#usage.");
  }

  let lowsrc;
  let lowsrcFormat;
  for(let format of LOWSRC_FORMAT_PREFERENCE) {
    if((format in metadata) && metadata[format].length) {
      lowsrcFormat = format;
      lowsrc = metadata[lowsrcFormat];
      break;
    }
  }

  // Handle if empty intersection between format and LOWSRC_FORMAT_PREFERENCE (e.g. gif)
  // If there’s only one format in the results, use that
  if(!lowsrc && formats.length === 1) {
    lowsrcFormat = formats[0];
    lowsrc = metadata[lowsrcFormat];
  }

  if(!lowsrc || !lowsrc.length) {
    throw new Error(`Could not find the lowest <img> source for responsive markup for ${originalSrc}`);
  }

  imgAttributes.src = lowsrc[0].url;

  if(htmlOptions.fallback === "largest" || htmlOptions.fallback === undefined) {
    imgAttributes.width = lowsrc[lowsrc.length - 1].width;
    imgAttributes.height = lowsrc[lowsrc.length - 1].height;
  } else if(htmlOptions.fallback === "smallest") {
    imgAttributes.width = lowsrc[0].width;
    imgAttributes.height = lowsrc[0].height;
  } else {
    throw new Error("Invalid `fallback` option specified. 'largest' and 'smallest' are supported. Received: " + htmlOptions.fallback);
  }

  let imgAttributesWithoutSizes = Object.assign({}, imgAttributes);
  delete imgAttributesWithoutSizes.sizes;

  // <img>: one format and one size
  if(entryCount === 1) {
    return {
      img: imgAttributesWithoutSizes
    };
  }

  // Per the HTML specification sizes is required srcset is using the `w` unit
  // https://html.spec.whatwg.org/dev/semantics.html#the-link-element:attr-link-imagesrcset-4
  // Using the default "100vw" is okay
  let missingSizesErrorMessage = `Missing \`sizes\` attribute on eleventy-img shortcode from: ${originalSrc}. Workarounds: 1. Use a single output width for this image 2. Use \`loading="lazy"\` (which uses sizes="auto" though browser support currently varies)`;

  // <img srcset>: one format and multiple sizes
  if(formats.length === 1) { // implied entryCount > 1
    if(entryCount > 1 && !imgAttributes.sizes) {
      // Use `sizes="auto"` when using `loading="lazy"` instead of throwing an error.
      if(imgAttributes.loading === "lazy") {
        imgAttributes.sizes = "auto";
      } else {
        throw new Error(missingSizesErrorMessage);
      }
    }

    let imgAttributesCopy = Object.assign({}, imgAttributesWithoutSizes);
    imgAttributesCopy.srcset = generateSrcset(lowsrc);
    imgAttributesCopy.sizes = imgAttributes.sizes;

    return {
      img: imgAttributesCopy
    };
  }

  let children = [];
  values.filter(imageFormat => {
    return imageFormat.length > 0 && (lowsrcFormat !== imageFormat[0].format);
  }).forEach(imageFormat => {
    if(imageFormat.length > 1 && !imgAttributes.sizes) {
      if(imgAttributes.loading === "lazy") {
        imgAttributes.sizes = "auto";
      } else {
        throw new Error(missingSizesErrorMessage);
      }
    }

    let sourceAttrs = {
      type: imageFormat[0].sourceType,
      srcset: generateSrcset(imageFormat),
    };

    if(imgAttributes.sizes) {
      sourceAttrs.sizes = imgAttributes.sizes;
    }

    children.push({
      "source": sourceAttrs
    });
  });

  /*
  Add lowsrc as an img, for browsers that don’t support picture or the formats provided in source

  If we have more than one size, we can use srcset and sizes.
  If the browser doesn't support those attributes, it should ignore them.
   */
  let imgAttributesForPicture = Object.assign({}, imgAttributesWithoutSizes);
  if (lowsrc.length > 1) {
    if (!imgAttributes.sizes) {
      // Per the HTML specification sizes is required srcset is using the `w` unit
      // https://html.spec.whatwg.org/dev/semantics.html#the-link-element:attr-link-imagesrcset-4
      // Using the default "100vw" is okay
      throw new Error(missingSizesErrorMessage);
    }

    imgAttributesForPicture.srcset = generateSrcset(lowsrc);
    imgAttributesForPicture.sizes = imgAttributes.sizes;
  }

  children.push({
    "img": imgAttributesForPicture
  });

  return {
    "picture": {
      ...pictureAttributes,
      [CHILDREN_OBJECT_KEY]: children,
    }
  };
}

function mapObjectToHTML(tagName, attrs = {}) {
  let attrHtml = Object.entries(attrs).map(entry => {
    let [key, value] = entry;
    if(key === CHILDREN_OBJECT_KEY) {
      return false;
    }

    // Issue #82
    if(key === "alt") {
      return `${key}="${value ? escapeAttribute(value) : ""}"`;
    }

    return `${key}="${value}"`;
  }).filter(keyPair => Boolean(keyPair)).join(" ");

  return `<${tagName}${attrHtml ? ` ${attrHtml}` : ""}>`;
}

function generateHTML(metadata, attributes = {}, htmlOptionsOverride = {}) {
  let htmlOptions = Object.assign({}, metadata?.eleventyImage?.htmlOptions, htmlOptionsOverride);

  let isInline = htmlOptions.whitespaceMode !== "block";
  let markup = [];

  // htmlOptions.imgAttributes and htmlOptions.pictureAttributes are merged in generateObject
  let obj = generateObject(metadata, attributes, {}, { htmlOptions });
  for(let tag in obj) {
    markup.push(mapObjectToHTML(tag, obj[tag]));

    // <picture>
    if(Array.isArray(obj[tag]?.[CHILDREN_OBJECT_KEY])) {
      for(let child of obj[tag][CHILDREN_OBJECT_KEY]) {
        let childTagName = Object.keys(child)[0];
        markup.push((!isInline ? "  " : "") + mapObjectToHTML(childTagName, child[childTagName]));
      }

      markup.push(`</${tag}>`);
    }
  }
  return markup.join(!isInline ? "\n" : "");
}

module.exports = generateHTML;
module.exports.generateObject = generateObject;
