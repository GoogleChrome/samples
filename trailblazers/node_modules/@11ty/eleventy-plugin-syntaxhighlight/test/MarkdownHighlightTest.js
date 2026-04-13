const test = require("ava");
const md = require("markdown-it");
const markdownPrismJsOptions = require("../src/markdownSyntaxHighlightOptions");

test("Test Markdown Highlighter", t => {
  let mdLib = md();
  mdLib.set({
    highlight: markdownPrismJsOptions({ alwaysWrapLineHighlights: true })
  });
  t.is(mdLib.render(`\`\`\`js
alert();
\`\`\``).trim(), `<pre class="language-js"><code class="language-js"><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span></code></pre>`);
});

test("Test Markdown Highlighter No Line Highlights", t => {
  let mdLib = md();
  mdLib.set({
    highlight: markdownPrismJsOptions()
  });
  t.is(mdLib.render(`\`\`\`js
alert();
\`\`\``).trim(), `<pre class="language-js"><code class="language-js"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`);
});

test("Markdown with `preAttributes`", t => {
  let mdLib = md();
  mdLib.set({
    highlight: markdownPrismJsOptions({
      alwaysWrapLineHighlights: true,
      preAttributes: {
        // will override class="language-js"
        class: ({language}) => "not-a-lang-" + language
      }
    })
  });
  t.is(mdLib.render(`\`\`\`js
alert();
\`\`\``).trim(), `<pre class="not-a-lang-js"><code class="language-js"><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span></code></pre>`);
});

test("Test Njk Alias", t => {
  let mdLib = md();
  mdLib.set({
    highlight: markdownPrismJsOptions()
  });
  t.is(mdLib.render(`\`\`\`njk
{% raw %}hello{% endraw %}
\`\`\``).trim(), `<pre class="language-njk"><code class="language-njk"><span class="token delimiter punctuation">{%</span> <span class="token tag keyword">raw</span> <span class="token operator">%</span><span class="token punctuation">}</span><span class="token variable">hello</span><span class="token punctuation">{</span><span class="token operator">%</span> <span class="token variable">endraw</span> <span class="token operator">%</span><span class="token punctuation">}</span></code></pre>`);
});

test("Test Nunjucks Alias", t => {
  let mdLib = md();
  mdLib.set({
    highlight: markdownPrismJsOptions()
  });
  t.is(mdLib.render(`\`\`\`nunjucks
{% raw %}hello{% endraw %}
\`\`\``).trim(), `<pre class="language-nunjucks"><code class="language-nunjucks"><span class="token delimiter punctuation">{%</span> <span class="token tag keyword">raw</span> <span class="token operator">%</span><span class="token punctuation">}</span><span class="token variable">hello</span><span class="token punctuation">{</span><span class="token operator">%</span> <span class="token variable">endraw</span> <span class="token operator">%</span><span class="token punctuation">}</span></code></pre>`);
});

test("Markdown Invalid language", t => {
  let mdLib = md();
  mdLib.set({
    highlight: markdownPrismJsOptions({
      errorOnInvalidLanguage: true
    })
  });

  t.throws(() => {
    mdLib.render(`\`\`\`asldkjflksdaj
hello
\`\`\``);
  });
});

test("Test loader invalid language with ignore", t => {
  let src = `\`\`\`asldkjflksdaj
hello
\`\`\``;

  let mdLib = md();
  mdLib.set({
    highlight: markdownPrismJsOptions()
  });
  t.is(mdLib.render(src).trim(), `<pre class="language-asldkjflksdaj"><code class="language-asldkjflksdaj">hello</code></pre>`);
});

// test("Test Markdown Highlighter Block Comment", t => {
//   let mdLib = md();
//   mdLib.set({
//     highlight: markdownPrismJsOptions({ alwaysWrapLineHighlights: true })
//   });
//   t.is(mdLib.render(`\`\`\`js
// /*
//  * this is a string
//  */
// \`\`\``).trim(), `<pre class="language-js"><code class="language-js"><span class="token comment"><span class="highlight-line">/*</span><br><span class="highlight-line"> * this is a string</span><br><span class="highlight-line"> */</span></span></code></pre>`);
// });

// TODO this still ain’t working right with the line highlighter.
// test("Test Markdown Highlighter GraphQL Example", t => {
//   let mdLib = md();
//   mdLib.set({
//     highlight: markdownPrismJsOptions({ alwaysWrapLineHighlights: true })
//   });
//   t.is(mdLib.render(`\`\`\`js
// var schema = buildSchema(\`type Query {
//   hello: String
// }\`);
// \`\`\``).trim(), ``);
// });
