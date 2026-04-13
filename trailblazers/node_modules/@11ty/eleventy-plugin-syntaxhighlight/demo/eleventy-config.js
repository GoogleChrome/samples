const syntaxHighlight = require("../.eleventy.js");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    // alwaysWrapLineHighlights: true
    preAttributes: { tabindex: 0 }
  });

  eleventyConfig.setTemplateFormats("njk,liquid,md,css");
};
