import test from "ava";
import Eleventy from '@11ty/eleventy';

test("JavaScript Function", async t => {
  let elev = new Eleventy("./test/11tyjs-test/", "./test/11tyjs-test/_site/", {
    configPath: "./test/11tyjs-test/.eleventy.js"
  });
  let json = await elev.toJSON();

  t.is(json.length, 1);
  let rendered = json[0].content;
	t.is(`<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> test<span class="token punctuation">;</span></code></pre>`, rendered);
});

test("JavaScript Function Diff #76", async t => {
  let elev = new Eleventy("./test/11tyjs-diff/", "./test/11tyjs-diff/_site/", {
    configPath: "./test/11tyjs-diff/.eleventy.js"
  });
  let json = await elev.toJSON();

  t.is(json.length, 1);
  let rendered = json[0].content;
	t.is(`<pre class="language-diff"><code class="language-diff"><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>var test;</span></code></pre>
<pre class="language-diff-js"><code class="language-diff-js"><span class="token deleted-sign deleted language-js"><span class="token prefix deleted">-</span><span class="token keyword">var</span> test<span class="token punctuation">;</span></span></code></pre>`, rendered);
});
