module.exports = function(data) {
  let result = this.highlight("js", "var test;");
  return result;
};
