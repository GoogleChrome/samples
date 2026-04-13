const test = require("ava");
const HighlightPairedShortcode = require("../src/HighlightPairedShortcode");

test("Base", async t => {
  t.is(await HighlightPairedShortcode(`alert();
alert();`, "js", "", { alwaysWrapLineHighlights: true }), `<pre class="language-js"><code class="language-js"><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span><br><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span></code></pre>`);
});

test("Base with LF EOL, always wrap highlights", async t => {
  t.is(await HighlightPairedShortcode('alert();\nalert();',
"js", "", { alwaysWrapLineHighlights: true }), `<pre class="language-js"><code class="language-js"><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span><br><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span></code></pre>`);
});

test("Base with LF EOL, no wrap highlights", async t => {
  t.is(await HighlightPairedShortcode('alert();\nalert();',
"js", "", { alwaysWrapLineHighlights: false }), `<pre class="language-js"><code class="language-js"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><br><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`);
});

test("Base with CRLF EOL, always wrap highlights", async t => {
  t.is(await HighlightPairedShortcode('alert();\r\nalert();',
"js", "", { alwaysWrapLineHighlights: true }), `<pre class="language-js"><code class="language-js"><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span><br><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span></code></pre>`);
});

test("Base with CRLF EOL, no wrap highlights", async t => {
  t.is(await HighlightPairedShortcode('alert();\r\nalert();',
"js", "", { alwaysWrapLineHighlights: false }), `<pre class="language-js"><code class="language-js"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><br><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`);
});

test("Base with custom attributes", async t => {
  t.is(await HighlightPairedShortcode(`alert();
alert();`, "js", "", { alwaysWrapLineHighlights: true, preAttributes: { tabindex: 0, 'data-testid': 'code' } }), `<pre class="language-js" tabindex="0" data-testid="code"><code class="language-js"><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span><br><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span></code></pre>`);
});

test("Base change the line separator", async t => {
  t.is(await HighlightPairedShortcode(`alert();
alert();`, "js", "", {
  alwaysWrapLineHighlights: true,
  lineSeparator: "\n",
}), `<pre class="language-js"><code class="language-js"><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span></code></pre>`);
});

test("Base No line highlights", async t => {
  t.is(await HighlightPairedShortcode(`alert();
alert();`, "js", ""), `<pre class="language-js"><code class="language-js"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><br><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`);
});

test("Highlight Active", async t => {
  t.is(await HighlightPairedShortcode(`alert();
alert();`, "js", "0", { alwaysWrapLineHighlights: true }), `<pre class="language-js"><code class="language-js"><mark class="highlight-line highlight-line-active"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></mark><br><span class="highlight-line"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span></code></pre>`);

  t.is(await HighlightPairedShortcode(`alert();
alert();`, "js", "0-1", { alwaysWrapLineHighlights: true }), `<pre class="language-js"><code class="language-js"><mark class="highlight-line highlight-line-active"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></mark><br><mark class="highlight-line highlight-line-active"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></mark></code></pre>`);
});

test("Highlight Add/Remove", async t => {
  t.is(await HighlightPairedShortcode(`alert();
alert();`, "js", "0 1", { alwaysWrapLineHighlights: true }), `<pre class="language-js"><code class="language-js"><ins class="highlight-line highlight-line-add"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></ins><br><del class="highlight-line highlight-line-remove"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></del></code></pre>`);

  t.is(await HighlightPairedShortcode(`alert();
alert();`, "js", "1 0", { alwaysWrapLineHighlights: true }), `<pre class="language-js"><code class="language-js"><del class="highlight-line highlight-line-remove"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></del><br><ins class="highlight-line highlight-line-add"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></ins></code></pre>`);
});

test("Test loader typescript", async t => {
  let script = `function greeter(person) {
    return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);`;

  t.is(await HighlightPairedShortcode(script, "typescript"), `<pre class="language-typescript"><code class="language-typescript"><span class="token keyword">function</span> <span class="token function">greeter</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span> <span class="token punctuation">{</span><br>    <span class="token keyword">return</span> <span class="token string">"Hello, "</span> <span class="token operator">+</span> person<span class="token punctuation">;</span><br><span class="token punctuation">}</span><br><br><span class="token keyword">let</span> user <span class="token operator">=</span> <span class="token string">"Jane User"</span><span class="token punctuation">;</span><br><br>document<span class="token punctuation">.</span>body<span class="token punctuation">.</span>textContent <span class="token operator">=</span> <span class="token function">greeter</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`);
});

test("Test loader ts", async t => {
  let script = `function greeter(person) {
    return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);`

  t.is(await HighlightPairedShortcode(script, "ts"), `<pre class="language-ts"><code class="language-ts"><span class="token keyword">function</span> <span class="token function">greeter</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span> <span class="token punctuation">{</span><br>    <span class="token keyword">return</span> <span class="token string">"Hello, "</span> <span class="token operator">+</span> person<span class="token punctuation">;</span><br><span class="token punctuation">}</span><br><br><span class="token keyword">let</span> user <span class="token operator">=</span> <span class="token string">"Jane User"</span><span class="token punctuation">;</span><br><br>document<span class="token punctuation">.</span>body<span class="token punctuation">.</span>textContent <span class="token operator">=</span> <span class="token function">greeter</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`);
});

test("Test loader invalid language, with errorOnInvalidLanguage option", async t => {
  await t.throwsAsync(async () => {
    await HighlightPairedShortcode("", "asldkjflksdaj", null, {
      errorOnInvalidLanguage: true
    });
  }, { message: `"asldkjflksdaj" is not a valid Prism.js language for eleventy-plugin-syntaxhighlight` });
});

test("Test loader invalid language (should pass)", async t => {
  t.is(await HighlightPairedShortcode("test test test", "asldkjflksdaj"), `<pre class="language-asldkjflksdaj"><code class="language-asldkjflksdaj">test test test</code></pre>`)
});

test("Test loader invalid language with ignore", async t => {
  let src = `hello
hello`
  t.is(await HighlightPairedShortcode(src, "asldkjflksdaj"), `<pre class="language-asldkjflksdaj"><code class="language-asldkjflksdaj">hello<br>hello</code></pre>`);
});

test("Trim content option (defaults true)", async t => {
  t.is(await HighlightPairedShortcode(` alert();
alert(); `, "js", "", {}), `<pre class="language-js"><code class="language-js"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><br><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`);

  t.is(await HighlightPairedShortcode(` alert();
alert(); `, "js", "", { trim: true }), `<pre class="language-js"><code class="language-js"><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><br><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`);

  t.is(await HighlightPairedShortcode(` alert();
alert(); `, "js", "", { trim: false }), `<pre class="language-js"><code class="language-js"> <span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><br><span class="token function">alert</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> </code></pre>`);

});
