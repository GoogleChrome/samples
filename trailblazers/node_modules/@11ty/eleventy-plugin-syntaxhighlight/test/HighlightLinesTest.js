const test = require("ava");
const HighlightLines = require("../src/HighlightLines");

test("HighlightLines empty", t => {
  let hilite = new HighlightLines("");
  t.is(hilite.isHighlighted(0), false);
});

test("HighlightLines single 0", t => {
  let hilite = new HighlightLines("0");
  t.is(hilite.isHighlighted(0), true);
  t.is(hilite.isHighlighted(1), false);
});

test("HighlightLines single 1", t => {
  let hilite = new HighlightLines("1");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), true);
});

test("HighlightLines range", t => {
  let hilite = new HighlightLines("1-3");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), true);
  t.is(hilite.isHighlighted(2), true);
  t.is(hilite.isHighlighted(3), true);
  t.is(hilite.isHighlighted(4), false);
});

test("HighlightLines multiple ranges", t => {
  let hilite = new HighlightLines("1-3,5-7");
  t.is(hilite.isHighlighted(0), false);
  t.is(hilite.isHighlighted(1), true);
  t.is(hilite.isHighlighted(2), true);
  t.is(hilite.isHighlighted(3), true);
  t.is(hilite.isHighlighted(4), false);
  t.is(hilite.isHighlighted(5), true);
  t.is(hilite.isHighlighted(6), true);
  t.is(hilite.isHighlighted(7), true);
  t.is(hilite.isHighlighted(8), false);
});
