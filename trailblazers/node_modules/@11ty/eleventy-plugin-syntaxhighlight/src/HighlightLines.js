class HighlightLines {
  constructor(rangeStr) {
    this.highlights = this.convertRangeToHash(rangeStr);
  }

  convertRangeToHash(rangeStr) {
    let hash = {};
    if( !rangeStr ) {
      return hash;
    }

    let ranges = rangeStr.split(",").map(function(range) {
      return range.trim();
    });

    for(let range of ranges) {
      let startFinish = range.split('-');
      let start = parseInt(startFinish[0], 10);
      let end = parseInt(startFinish[1] || start, 10);

      for( let j = start, k = end; j<=k; j++ ) {
        hash[j] = true;
      }
    }
    return hash;
  }

  isHighlighted(lineNumber) {
    return !!this.highlights[lineNumber];
  }
}

module.exports = HighlightLines;
