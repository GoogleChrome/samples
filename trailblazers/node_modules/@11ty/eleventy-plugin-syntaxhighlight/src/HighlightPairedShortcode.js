const Prism = require("prismjs");
const PrismLoader = require("./PrismLoader");
const HighlightLinesGroup = require("./HighlightLinesGroup");
const getAttributes = require("./getAttributes");

module.exports = function (content, language, highlightNumbers, options = {}) {
  // default to on
  if(options.trim === undefined || options.trim === true) {
    content = content.trim();
  }

  let highlightedContent;
  if( language === "text" ) {
    highlightedContent = content;
  } else {
    let loader = PrismLoader(language, options);
    if(!loader) {
      highlightedContent = content;
    } else {
      highlightedContent = Prism.highlight(content, loader, language);
    }
  }

  let group = new HighlightLinesGroup(highlightNumbers);
  let lines = highlightedContent.split(/\r?\n/);
  lines = lines.map(function(line, j) {
    if(options.alwaysWrapLineHighlights || highlightNumbers) {
      let lineContent = group.getLineMarkup(j, line);
      return lineContent;
    }
    return line;
  });

  const context = { content: content, language: language,  options: options };
  const preAttributes = getAttributes(options.preAttributes, context);
  const codeAttributes = getAttributes(options.codeAttributes, context);

  return `<pre${preAttributes}><code${codeAttributes}>` + lines.join(options.lineSeparator || "<br>") + "</code></pre>";
};
