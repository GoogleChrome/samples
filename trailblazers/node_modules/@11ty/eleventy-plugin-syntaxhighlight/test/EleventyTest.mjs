import test from "ava";
import Eleventy from '@11ty/eleventy';

function normalizeNewLines(str) {
  return str.replace(/\r\n/g, "\n");
}

test("Diff output escaped #75", async t => {
  let elev = new Eleventy("./test/issue-75/", "./test/issue-75/_site/", {
    configPath: "./test/issue-75/.eleventy.js"
  });
  let json = await elev.toJSON();

  t.is(json.length, 1);
	t.is(normalizeNewLines(json[0].content.trim()), normalizeNewLines(`<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>Hello<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></code></pre>
<pre class="language-diff-html"><code class="language-diff-html"><span class="token deleted-sign deleted language-html"><span class="token prefix deleted">-</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>Hello<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></span></code></pre>`));
});

test("diff-javascript #80", async t => {
  let elev = new Eleventy("./test/issue-80/", "./test/issue-80/_site/", {
    configPath: "./test/issue-80/.eleventy.js"
  });
  let json = await elev.toJSON();

  t.is(json.length, 1);
	t.is(normalizeNewLines(json[0].content.trim()), normalizeNewLines(`<pre class="language-diff-javascript"><code class="language-diff-javascript"><span class="token deleted-sign deleted language-javascript"><span class="token prefix deleted">-</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</span></code></pre>`));
});
