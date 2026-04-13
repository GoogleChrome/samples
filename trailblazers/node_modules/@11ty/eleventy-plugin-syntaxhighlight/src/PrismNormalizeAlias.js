const HARDCODED_ALIASES = {
  njk: "jinja2",
  nunjucks: "jinja2",
};

// This was added to make `ts` resolve to `typescript` correctly.
// The Prism loader doesn’t seem to always handle aliasing correctly.
module.exports = function(language) {
  try {
    // Careful this is not public API stuff:
    // https://github.com/PrismJS/prism/issues/2146
    const PrismComponents = require("prismjs/components.json");
    let langs = PrismComponents.languages;

    // Manual override
    if(HARDCODED_ALIASES[language]) {
      language = HARDCODED_ALIASES[language];
    }

    if(langs[ language ]) {
      return language;
    }
    for(let langName in langs) {
      if(Array.isArray(langs[langName].alias)) {
        for(let alias of langs[langName].alias) {
          if(alias === language) {
            return langName;
          }
        }
      } else if(langs[langName].alias === language) {
        return langName;
      }
    }
  } catch(e) {
    // Couldn’t find the components file, aliases may not resolve correctly
    // See https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/19
  }

  return language;
}
