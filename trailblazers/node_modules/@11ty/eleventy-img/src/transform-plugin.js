const path = require("node:path");
const Util = require("./util.js");
const { imageAttributesToPosthtmlNode, getOutputDirectory, cleanTag, isIgnored, isOptional } = require("./image-attrs-to-posthtml-node.js");
const { getGlobalOptions } = require("./global-options.js");
const { eleventyImageOnRequestDuringServePlugin } = require("./on-request-during-serve-plugin.js");

const PLACEHOLDER_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const ATTRS = {
  ORIGINAL_SOURCE: "eleventy:internal_original_src",
};

function getSrcAttributeValue(sourceNode/*, rootTargetNode*/) {
  // Debatable TODO: use rootTargetNode (if `picture`) to retrieve a potentially higher quality source from <source srcset>
  return sourceNode.attrs?.src;
}

function assignAttributes(rootTargetNode, newNode) {
  // only copy attributes if old and new tag name are the same (picture => picture, img => img)
  if(rootTargetNode.tag !== newNode.tag) {
    delete rootTargetNode.attrs;
  }

  if(!rootTargetNode.attrs) {
    rootTargetNode.attrs = {};
  }

  // Copy all new attributes to target
  if(newNode.attrs) {
    Object.assign(rootTargetNode.attrs, newNode.attrs);
  }
}

function getOutputLocations(originalSource, outputDirectoryFromAttribute, pageContext, options) {
  let projectOutputDirectory = options.directories.output;

  if(outputDirectoryFromAttribute) {
    if(path.isAbsolute(outputDirectoryFromAttribute)) {
      return {
        outputDir: path.join(projectOutputDirectory, outputDirectoryFromAttribute),
        urlPath: outputDirectoryFromAttribute,
      };
    }
    return {
      outputDir: path.join(projectOutputDirectory, pageContext.url, outputDirectoryFromAttribute),
      urlPath: path.join(pageContext.url, outputDirectoryFromAttribute),
    };
  }

  if(options.urlPath) {
    // do nothing, user has specified directories in the plugin options.
    return {};
  }

  if(path.isAbsolute(originalSource)) {
    // if the path is an absolute one (relative to the content directory) write to a global output directory to avoid duplicate writes for identical source images.
    return {
      outputDir: path.join(projectOutputDirectory, "/img/"),
      urlPath: "/img/",
    };
  }

  // If original source is a relative one, this colocates images to the template output.
  let dir = path.dirname(pageContext.outputPath);

  // filename is included in url: ./dir/post.html => /dir/post.html
  if(pageContext.outputPath.endsWith(pageContext.url)) {
    // remove file name
    let split = pageContext.url.split("/");
    split[split.length - 1] = "";

    return {
      outputDir: dir,
      urlPath: split.join("/"),
    };
  }

  // filename is not included in url: ./dir/post/index.html => /dir/post/
  return {
    outputDir: dir,
    urlPath: pageContext.url,
  };
}

function transformTag(context, sourceNode, rootTargetNode, opts) {
  let originalSource = getSrcAttributeValue(sourceNode, rootTargetNode);

  if(!originalSource) {
    return sourceNode;
  }

  let { inputPath } = context.page;

  sourceNode.attrs.src = Util.normalizeImageSource({
    input: opts.directories.input,
    inputPath,
  }, originalSource, {
    isViaHtml: true, // this reference came from HTML, so we can decode the file name
  });

  if(sourceNode.attrs.src !== originalSource) {
    sourceNode.attrs[ATTRS.ORIGINAL_SOURCE] = originalSource;
  }

  let outputDirectoryFromAttribute = getOutputDirectory(sourceNode);
  let instanceOptions = getOutputLocations(originalSource, outputDirectoryFromAttribute, context.page, opts);

  // returns promise
  return imageAttributesToPosthtmlNode(sourceNode.attrs, instanceOptions, opts).then(newNode => {
    // node.tag
    // node.attrs
    // node.content

    assignAttributes(rootTargetNode, newNode);

    rootTargetNode.tag = newNode.tag;
    rootTargetNode.content = newNode.content;
  }, (error) => {
    if(isOptional(sourceNode) || !opts.failOnError) {
      if(isOptional(sourceNode, "keep")) {
        // replace with the original source value, no image transformation is taking place
        if(sourceNode.attrs[ATTRS.ORIGINAL_SOURCE]) {
          sourceNode.attrs.src = sourceNode.attrs[ATTRS.ORIGINAL_SOURCE];
        }
        // leave as-is, likely 404 when a user visits the page
      } else if(isOptional(sourceNode, "placeholder")) {
        // transparent png
        sourceNode.attrs.src = PLACEHOLDER_DATA_URI;
      } else if(isOptional(sourceNode)) {
        delete sourceNode.attrs.src;
      }

      // optional or don’t fail on error
      cleanTag(sourceNode);

      return Promise.resolve();
    }

    return Promise.reject(error);
  });
}

function eleventyImageTransformPlugin(eleventyConfig, options = {}) {
  options = Object.assign({
    extensions: "html",
    transformOnRequest: process.env.ELEVENTY_RUN_MODE === "serve",
  }, options);

  if(options.transformOnRequest !== false) {
    // Add the on-request plugin automatically (unless opt-out in this plugins options only)
    eleventyConfig.addPlugin(eleventyImageOnRequestDuringServePlugin);
  }

  // Notably, global options are not shared automatically with the WebC `eleventyImagePlugin` above.
  // Devs can pass in the same object to both if they want!
  let opts = getGlobalOptions(eleventyConfig, options, "transform");

  eleventyConfig.addJavaScriptFunction("__private_eleventyImageTransformConfigurationOptions", () => {
    return opts;
  });

  function posthtmlPlugin(context) {
    return async (tree) => {
      let promises = [];
      let match = tree.match;

      tree.match({ tag: 'picture' }, pictureNode => {
        match.call(pictureNode, { tag: 'img' }, imgNode => {
          imgNode._insideOfPicture = true;

          if(!isIgnored(imgNode) && !imgNode?.attrs?.src?.startsWith("data:")) {
            promises.push(transformTag(context, imgNode, pictureNode, opts));
          }

          return imgNode;
        });

        return pictureNode;
      });

      tree.match({ tag: 'img' }, (imgNode) => {
        if(imgNode._insideOfPicture) {
          delete imgNode._insideOfPicture;
        } else if(isIgnored(imgNode) || imgNode?.attrs?.src?.startsWith("data:")) {
          cleanTag(imgNode);
        } else {
          promises.push(transformTag(context, imgNode, imgNode, opts));
        }

        return imgNode;
      });

      await Promise.all(promises);

      return tree;
    };
  }

  if(!eleventyConfig.htmlTransformer || !("addPosthtmlPlugin" in eleventyConfig.htmlTransformer)) {
    throw new Error("[@11ty/eleventy-img] `eleventyImageTransformPlugin` is not compatible with this version of Eleventy. You will need to use v3.0.0 or newer.");
  }

  eleventyConfig.htmlTransformer.addPosthtmlPlugin(options.extensions, posthtmlPlugin, {
    priority: -1, // we want this to go before <base> or inputpath to url
  });
}

module.exports = {
  eleventyImageTransformPlugin,
};
