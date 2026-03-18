import u from "openai";
import { P as m, D as l } from "../chunks/defaults-CzvdT-At.js";
class y extends m {
  #e;
  constructor(t) {
    super(t.modelName || l.openai.modelName), this.config = t, this.openai = new u({
      apiKey: t.apiKey,
      dangerouslyAllowBrowser: !0
      // Required for client-side usage
    });
  }
  static availability(t = {}) {
    if (t.expectedInputs) {
      const s = t.expectedInputs.some(
        (e) => e.type === "audio"
      ), o = t.expectedInputs.some(
        (e) => e.type === "image"
      );
      if (s && o)
        return "unavailable";
    }
    return "available";
  }
  /**
   * Translates a standard JSON Schema into a backend-specific format.
   * OpenAI Structured Outputs require:
   * 1. All fields in objects to be marked as 'required'.
   * 2. Objects to have 'additionalProperties: false'.
   * 3. The root must be an 'object'.
   * @param {Object} schema - The standard JSON Schema.
   * @returns {any} The backend-specific schema.
   */
  convertSchema(t) {
    if (typeof t != "object" || t === null)
      return { schema: t, wrapped: !1 };
    const s = (e) => {
      if (e.type === "object")
        if (e.properties) {
          e.additionalProperties = !1, e.required = Object.keys(e.properties);
          for (const r in e.properties)
            s(e.properties[r]);
        } else
          e.additionalProperties = !1, e.required = [];
      else e.type === "array" && e.items && s(e.items);
      return e;
    }, o = JSON.parse(JSON.stringify(t));
    return o.type !== "object" ? {
      wrapped: !0,
      schema: {
        type: "object",
        properties: { value: o },
        required: ["value"],
        additionalProperties: !1
      }
    } : {
      wrapped: !1,
      schema: s(o)
    };
  }
  /**
   * Creates a model session and stores it.
   * @param {Object} options - LanguageModel options.
   * @param {Object} sessionParams - Parameters for the cloud or local model.
   * @returns {any} The created session object.
   */
  createSession(t, s) {
    this.#e = {
      model: t.modelName || this.modelName,
      systemInstruction: s.systemInstruction
    };
    const o = s.generationConfig || {};
    if (o.responseSchema) {
      const { schema: e, wrapped: r } = o.responseSchema;
      this.#e.response_format = {
        type: "json_schema",
        json_schema: {
          name: "response",
          strict: !0,
          schema: e
        }
      }, this.#e.response_wrapped = r;
    } else o.responseMimeType === "application/json" && (this.#e.response_format = { type: "json_object" });
    return this.#e;
  }
  #t(t) {
    let s = !1, o = !1;
    for (const e of t)
      if (Array.isArray(e.content))
        for (const r of e.content)
          r.type === "image_url" && (s = !0), r.type === "input_audio" && (o = !0);
    if (s && o)
      throw new Error(
        "OpenAI backend does not support mixing images and audio in the same session. Please start a new session."
      );
    return { hasImage: s, hasAudio: o };
  }
  #s(t) {
    return this.#e.model !== this.modelName ? this.#e.model : t ? `${this.modelName}-audio-preview` : this.modelName;
  }
  /**
   * Generates content (non-streaming).
   * @param {Array} contents - The history + new message content.
   * @returns {Promise<{text: string, usage: number}>}
   */
  async generateContent(t) {
    const { messages: s } = this.#o(
      t,
      this.#e.systemInstruction
    ), { hasAudio: o } = this.#t(s), e = this.#s(o);
    if (e === `${this.modelName}-audio-preview` && this.#e.response_format)
      throw new DOMException(
        `OpenAI audio model ('${e}') does not support structured outputs (responseConstraint).`,
        "NotSupportedError"
      );
    const r = {
      model: e,
      messages: s
    };
    this.#e.temperature > 0 && (r.temperature = this.#e.temperature), this.#e.response_format && (r.response_format = this.#e.response_format);
    try {
      const a = await this.openai.chat.completions.create(r);
      let i = a.choices[0].message.content;
      if (this.#e.response_wrapped && i)
        try {
          const c = JSON.parse(i);
          c && typeof c == "object" && "value" in c && (i = JSON.stringify(c.value));
        } catch {
        }
      const p = a.usage?.prompt_tokens || 0;
      return { text: i, usage: p };
    } catch (a) {
      throw console.error("OpenAI Generate Content Error:", a), a;
    }
  }
  /**
   * Generates content stream.
   * @param {Array} contents - The history + new content.
   * @returns {Promise<AsyncIterable>} Stream of chunks.
   */
  async generateContentStream(t) {
    const { messages: s } = this.#o(
      t,
      this.#e.systemInstruction
    ), { hasAudio: o } = this.#t(s), e = this.#s(o);
    if (e === `${this.modelName}-audio-preview` && this.#e.response_format)
      throw new DOMException(
        `OpenAI audio model ('${e}') does not support structured outputs (responseConstraint).`,
        "NotSupportedError"
      );
    const r = {
      model: e,
      messages: s,
      stream: !0
    };
    this.#e.temperature > 0 && (r.temperature = this.#e.temperature), this.#e.response_format && (r.response_format = this.#e.response_format);
    try {
      const a = await this.openai.chat.completions.create(r);
      return (async function* () {
        for await (const n of a) {
          let i = n.choices[0]?.delta?.content;
          i && (yield {
            text: () => i,
            usageMetadata: { totalTokenCount: 0 }
          });
        }
      })();
    } catch (a) {
      throw console.error("OpenAI Generate Content Stream Error:", a), a;
    }
  }
  /**
   * Counts tokens.
   * @param {Array} contents - The content to count.
   * @returns {Promise<number>} Total tokens.
   */
  async countTokens(t) {
    let s = "";
    if (Array.isArray(t)) {
      for (const o of t)
        if (o.parts)
          for (const e of o.parts)
            e.text ? s += e.text : e.inlineData && (s += " ".repeat(1e3));
    }
    return Math.ceil(s.length / 4);
  }
  #o(t, s) {
    const o = [];
    s && o.push({
      role: "system",
      content: s
    });
    for (const e of t) {
      const r = e.role === "model" ? "assistant" : "user", a = [];
      for (const n of e.parts)
        if (n.text)
          a.push({ type: "text", text: n.text });
        else if (n.inlineData) {
          const { data: i, mimeType: p } = n.inlineData;
          p.startsWith("image/") ? a.push({
            type: "image_url",
            image_url: { url: `data:${p};base64,${i}` }
          }) : p.startsWith("audio/") && a.push({
            type: "input_audio",
            input_audio: {
              data: i,
              format: p.split("/")[1] === "mpeg" ? "mp3" : "wav"
            }
          });
        }
      o.push({ role: r, content: a });
    }
    return { messages: o };
  }
}
export {
  y as default
};
