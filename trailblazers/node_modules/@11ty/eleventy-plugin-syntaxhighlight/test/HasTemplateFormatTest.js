const test = require("ava");
const hasTemplateFormat = require("../src/hasTemplateFormat");

test("hasTemplateFormats", t => {
  t.true(hasTemplateFormat("*", "liquid"));
  t.false(hasTemplateFormat([], "liquid"));

  // options not specified, defaults to *
  t.true(hasTemplateFormat(undefined, "liquid"));
  t.false(hasTemplateFormat(null, "liquid"));

  t.true(hasTemplateFormat("*", false));
  t.false(hasTemplateFormat([], false));

  // options not specified, defaults to *
  t.true(hasTemplateFormat(undefined, false));
  t.false(hasTemplateFormat(null, false));

  t.true(hasTemplateFormat(["*"], "liquid"));
  t.true(hasTemplateFormat(["liquid"], "liquid"));
  t.true(hasTemplateFormat(["liquid", "njk"], "liquid"));
  t.true(hasTemplateFormat(["liquid", "njk"], "njk"));
  t.true(hasTemplateFormat(["liquid", "njk", "md"], "md"));
  t.false(hasTemplateFormat(["liquid", "njk", "md"], "pug"));
});
