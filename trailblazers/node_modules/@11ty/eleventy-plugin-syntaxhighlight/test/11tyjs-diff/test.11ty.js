module.exports = function(data) {
  let result1 = this.highlight("diff", "-var test;");
  let result2 = this.highlight("diff-js", "-var test;");
  return result1 + "\n" + result2;
};
