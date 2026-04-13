module.exports = function(templateFormats = ["*"], format = false) {
  if(!Array.isArray(templateFormats)) {
    templateFormats = [templateFormats];
  }

  if( Array.isArray(templateFormats) ) {
    if( templateFormats.indexOf("*") > -1 || templateFormats.indexOf(format) > -1 ) {
      return true;
    }
  }

  return false;
};
