const HighlightLines = require("./HighlightLines");

class HighlightLinesGroup {
  constructor(str, delimiter) {
    this.init(str, delimiter);
  }

  init(str = "", delimiter = " ") {
    this.str = str;
    this.delimiter = delimiter;

    let split = str.split(this.delimiter);
    this.highlights = new HighlightLines(split.length === 1 ? split[0] : "");
    this.highlightsAdd = new HighlightLines(split.length === 2 ? split[0] : "");
    this.highlightsRemove = new HighlightLines(split.length === 2 ? split[1] : "");
  }

  isHighlighted(lineNumber) {
    return this.highlights.isHighlighted(lineNumber);
  }

  isHighlightedAdd(lineNumber) {
    return this.highlightsAdd.isHighlighted(lineNumber);
  }

  isHighlightedRemove(lineNumber) {
    return this.highlightsRemove.isHighlighted(lineNumber);
  }

  hasTagMismatch(line) {
    let startCount = line.split("<span").length;
    let endCount = line.split("</span").length;
    if( startCount !== endCount ) {
      return true;
    }

    return false;
  }

  splitLineMarkup(line, before, after) {

    // skip line highlighting if there is an uneven number of <span> or </span> on the line.
    // for example, we can’t wrap <span> with <span><span></span>
    if(this.hasTagMismatch(line)) {
      return line;
    }

    return before + line + after;
  }

  getLineMarkup(lineNumber, line, extraClasses = []) {
    let extraClassesStr = (extraClasses.length ? " " + extraClasses.join(" ") : "");

    if (this.isHighlighted(lineNumber)) {
      return this.splitLineMarkup(line, `<mark class="highlight-line highlight-line-active${extraClassesStr}">`, `</mark>`);
    }
    if (this.isHighlightedAdd(lineNumber)) {
      return this.splitLineMarkup(line, `<ins class="highlight-line highlight-line-add${extraClassesStr}">`, `</ins>`);
    }
    if (this.isHighlightedRemove(lineNumber)) {
      return this.splitLineMarkup(line, `<del class="highlight-line highlight-line-remove${extraClassesStr}">`, `</del>`);
    }

    return this.splitLineMarkup( line, `<span class="highlight-line${extraClassesStr}">`, `</span>`);
  }
}

module.exports = HighlightLinesGroup;
