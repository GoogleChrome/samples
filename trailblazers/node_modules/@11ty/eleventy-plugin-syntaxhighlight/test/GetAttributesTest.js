const test = require("ava");
const ga = require("../src/getAttributes");

test("Falsy", t => {
  t.is(ga(false), "");
  t.is(ga(null), "");
  t.is(ga(undefined), "");
  t.is(ga(""), "");
  t.throws(() => {
    ga(" test='1'");
  });
});

test("Object syntax", t => {
  t.is(ga({}), "");
  t.is(ga({ hi: 1 }), ' hi="1"');
  t.is(ga({ hi: 1, bye: 2 }), ' hi="1" bye="2"');
  t.is(ga({ class: "my-class", bye: 2 }), ' class="my-class" bye="2"');
  t.is(ga({ hi: function(ctx) { return '1'; }, bye: 2 }), ' hi="1" bye="2"');
});

test("Function callback", t => {
  t.is(ga({ "data-lang": ({language}) => language }, {
    language: "html"
  }), ' class="language-html" data-lang="html"');
});

test("Function callback with class attribute (override)", t => {
  t.is(ga({
    class: ({language}) => "my-custom-"+language
  }, {
    language: "html"
  }), ' class="my-custom-html"');
});

test("Function callback must return string or integer", t => {
  t.throws(() => {
    ga({ "data-lang": ({language}) => undefined }, {
      language: "html"
    })
  });

  t.throws(() => {
    ga({ "data-lang": ({language}) => {} }, {
      language: "html"
    })
  });

  t.throws(() => {
    ga({ "data-lang": ({language}) => false }, {
      language: "html"
    })
  });
});
