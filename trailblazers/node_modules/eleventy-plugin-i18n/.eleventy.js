const pkg = require('./package.json');
const i18n = require('./i18n.js');

const defaultOptions = {
  translations: {},
  fallbackLocales: {}
};

module.exports = function (eleventyConfig, configGlobalOptions = {}) {
  try {
    eleventyConfig.versionCheck(pkg['11ty'].compatibility);
  } catch (e) {
    console.log(
      `WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}`
    );
  }
  const pluginOptions = Object.assign({}, defaultOptions, configGlobalOptions);

  eleventyConfig.addFilter('i18n', function (key, data, localeOverride) {
    // TBC Here we need to determine if filter is being used on page or in include, respectively
    const page = this.page || this.ctx.page;
    return i18n(key, data, localeOverride, pluginOptions, page);
  });
};
