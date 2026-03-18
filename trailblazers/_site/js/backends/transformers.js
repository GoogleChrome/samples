import { env as p, pipeline as m, TextStreamer as h } from "@huggingface/transformers";
import { P as f, D as c } from "../chunks/defaults-CzvdT-At.js";
class w extends f {
  #e;
  #t;
  #r;
  #a;
  #n;
  constructor(t = {}) {
    if (super(t.modelName || c.transformers.modelName), this.#r = t.device || c.transformers.device, this.#a = t.dtype || c.transformers.dtype, t.isDefault && console.log(
      `Polyfill: No backend configuration found. Defaulting to Transformers.js with model: ${this.modelName}`
    ), p.experimental_useCrossOriginStorage = !0, t.env) {
      const e = (n, o) => {
        for (const [r, s] of Object.entries(o))
          s && typeof s == "object" && !Array.isArray(s) && n[r] && typeof n[r] == "object" ? e(n[r], s) : n[r] = s;
      };
      e(p, t.env);
    }
  }
  /**
   * Loaded models can be large, so we initialize them lazily.
   * @param {EventTarget} [monitorTarget] - The event target to dispatch download progress events to.
   * @returns {Promise<Object>} The generator.
   */
  async #s(t) {
    if (!this.#e) {
      const e = (o) => {
        if (!t)
          return;
        const r = 1 / 65536, s = Math.floor(o / r) * r;
        s <= t.__lastProgressLoaded || (t.dispatchEvent(
          new ProgressEvent("downloadprogress", {
            loaded: s,
            total: 1,
            lengthComputable: !0
          })
        ), t.__lastProgressLoaded = s);
      }, n = (o) => {
        o.status === "progress_total" ? e(o.progress / 100) : o.status === "ready" && e(1);
      };
      e(0), this.#e = await m("text-generation", this.modelName, {
        device: this.#r,
        dtype: this.#a,
        progress_callback: n
      }), this.#t = this.#e.tokenizer;
    }
    return this.#e;
  }
  /**
   * Checks if the backend is available given the options.
   * @param {Object} options - LanguageModel options.
   * @returns {string} 'available' or 'unavailable'.
   */
  static availability(t) {
    if (t?.expectedInputs && Array.isArray(t.expectedInputs)) {
      for (const e of t.expectedInputs)
        if (e.type === "audio" || e.type === "image")
          return "unavailable";
    }
    return "available";
  }
  /**
   * Creates a new session.
   * @param {Object} options - LanguageModel options.
   * @param {Object} sessionParams - Session parameters.
   * @param {EventTarget} [monitorTarget] - The event target to dispatch download progress events to.
   * @returns {Promise<Object>} The generator.
   */
  async createSession(t, e, n) {
    return await this.#s(n), this.generationConfig = {
      max_new_tokens: 512,
      // Default limit
      do_sample: !1,
      return_full_text: !1
    }, this.#n = e.systemInstruction, this.responseSchema = e.generationConfig?.responseSchema, this.responseSchema && console.warn(
      "Polyfill: `responseConstraint` is not natively supported by the Transformers.js backend and is implemented via prompt engineering, which may fail. For better results, consider adding few-shot examples to your prompt."
    ), this.#e;
  }
  /**
   * Generates content (non-streaming).
   * @param {Array} contents - The history + new message content.
   * @returns {Promise<{text: string, usage: number}>}
   */
  async generateContent(t) {
    const e = await this.#s(), n = this.#o(t), o = this.#t.apply_chat_template(n, {
      tokenize: !1,
      add_generation_prompt: !0
    }), s = (await e(o, {
      ...this.generationConfig,
      add_special_tokens: !1
    }))[0].generated_text, i = await this.countTokens(t);
    return { text: s, usage: i };
  }
  /**
   * Generates content stream.
   * @param {Array} contents - The history + new content.
   * @returns {Promise<AsyncIterable>} Stream of chunks.
   */
  async generateContentStream(t) {
    const e = await this.#s(), n = this.#o(t), o = this.#t.apply_chat_template(n, {
      tokenize: !1,
      add_generation_prompt: !0
    }), r = [];
    let s, i = new Promise((a) => s = a), l = !1;
    const u = (a) => {
      r.push(a), s && (s(), s = null);
    }, d = new h(this.#t, {
      skip_prompt: !0,
      skip_special_tokens: !0,
      callback_function: u
    });
    return e(o, {
      ...this.generationConfig,
      add_special_tokens: !1,
      streamer: d
    }).then(() => {
      l = !0, s && (s(), s = null);
    }).catch((a) => {
      console.error("[Transformers.js] Generation error:", a), l = !0, s && (s(), s = null);
    }), (async function* () {
      for (; ; ) {
        for (r.length === 0 && !l && (s || (i = new Promise((a) => s = a)), await i); r.length > 0; ) {
          const a = r.shift();
          yield {
            text: () => a,
            usageMetadata: { totalTokenCount: 0 }
          };
        }
        if (l)
          break;
      }
    })();
  }
  /**
   * Counts tokens.
   * @param {Array} contents - The content to count.
   * @returns {Promise<number>} Total tokens.
   */
  async countTokens(t) {
    await this.#s();
    const e = this.#o(t);
    return this.#t.apply_chat_template(e, {
      tokenize: !0,
      add_generation_prompt: !1,
      return_tensor: !1
    }).length;
  }
  #o(t) {
    const e = t.map((n) => {
      let o = n.role === "model" ? "assistant" : n.role === "system" ? "system" : "user";
      const r = n.parts.map((s) => s.text).join("");
      return { role: o, content: r };
    });
    if (this.#n && !e.some((n) => n.role === "system") && e.unshift({ role: "system", content: this.#n }), this.#i(e), this.modelName.toLowerCase().includes("gemma")) {
      const n = e.findIndex((o) => o.role === "system");
      if (n !== -1) {
        const o = e[n], r = e.findIndex(
          (s, i) => s.role === "user" && i > n
        );
        r !== -1 ? (e[r].content = o.content + `

` + e[r].content, e.splice(n, 1)) : (o.content += `

`, o.role = "user");
      }
    }
    return e;
  }
  #i(t) {
    if (this.responseSchema) {
      const e = `Respond ONLY with a raw JSON object matching this JSON Schema:

\`\`\`json
${JSON.stringify(this.responseSchema, null, 2)}
\`\`\`

DO NOT include Markdown code blocks, explanations, or any other text.`;
      t.length > 0 && t[0].role === "system" ? t[0].content = e + `

` + t[0].content : t.unshift({ role: "system", content: e });
    }
  }
}
export {
  w as default
};
