const test = require("ava");
const HighlightLinesGroup = require("../src/HighlightLinesGroup");

test("Empty", t => {
  let hilite = new HighlightLinesGroup("");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), false);
});

test("Highlight irrelevant (-)", t => {
  let hilite = new HighlightLinesGroup("-");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), false);
});

test("Highlight simple (0)", t => {
  let hilite = new HighlightLinesGroup("0");
  t.is(hilite.isHighlighted(0), true);
  t.is(hilite.isHighlighted(1), false);
});


test("Highlight simple (1)", t => {
  let hilite = new HighlightLinesGroup("1");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), true);
});

test("Highlight complex", t => {
  let hilite = new HighlightLinesGroup("1-2,4");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), true);
  t.is(hilite.isHighlighted(2), true);
  t.is(hilite.isHighlighted(3), false);
  t.is(hilite.isHighlighted(4), true);
  t.is(hilite.isHighlighted(5), false);
});

test("Add/Remove", t => {
  let hilite = new HighlightLinesGroup("1-2,4 3");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), false);
  t.is(hilite.isHighlighted(2), false);
  t.is(hilite.isHighlighted(3), false);
  t.is(hilite.isHighlighted(4), false);
  t.is(hilite.isHighlighted(5), false);

  t.is(hilite.isHighlightedAdd(0), false);
  t.is(hilite.isHighlightedAdd(1), true);
  t.is(hilite.isHighlightedAdd(2), true);
  t.is(hilite.isHighlightedAdd(3), false);
  t.is(hilite.isHighlightedAdd(4), true);
  t.is(hilite.isHighlightedAdd(5), false);

  t.is(hilite.isHighlightedRemove(0), false);
  t.is(hilite.isHighlightedRemove(1), false);
  t.is(hilite.isHighlightedRemove(2), false);
  t.is(hilite.isHighlightedRemove(3), true);
  t.is(hilite.isHighlightedRemove(4), false);
  t.is(hilite.isHighlightedRemove(5), false);
});

test("Add/Remove New Delimiter", t => {
  let hilite = new HighlightLinesGroup("1-2,4/3", "/");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), false);
  t.is(hilite.isHighlighted(2), false);
  t.is(hilite.isHighlighted(3), false);
  t.is(hilite.isHighlighted(4), false);
  t.is(hilite.isHighlighted(5), false);

  t.is(hilite.isHighlightedAdd(0), false);
  t.is(hilite.isHighlightedAdd(1), true);
  t.is(hilite.isHighlightedAdd(2), true);
  t.is(hilite.isHighlightedAdd(3), false);
  t.is(hilite.isHighlightedAdd(4), true);
  t.is(hilite.isHighlightedAdd(5), false);

  t.is(hilite.isHighlightedRemove(0), false);
  t.is(hilite.isHighlightedRemove(1), false);
  t.is(hilite.isHighlightedRemove(2), false);
  t.is(hilite.isHighlightedRemove(3), true);
  t.is(hilite.isHighlightedRemove(4), false);
  t.is(hilite.isHighlightedRemove(5), false);
});

test("Split Line Markup", t => {
  let hilite = new HighlightLinesGroup("", " ");
  t.is(hilite.splitLineMarkup("Test", "BEFORE", "AFTER"), "BEFORETestAFTER");
  t.is(hilite.splitLineMarkup("<span>Test</span>", "BEFORE", "AFTER"), "BEFORE<span>Test</span>AFTER");
  t.is(hilite.splitLineMarkup("<span>Test", "BEFORE", "AFTER"), "<span>Test");
  t.is(hilite.splitLineMarkup("Test</span>", "BEFORE", "AFTER"), "Test</span>");
});
