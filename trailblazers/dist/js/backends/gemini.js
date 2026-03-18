import { GoogleGenAI as s } from "@google/genai";
import { P as a, D as i } from "../chunks/defaults-CzvdT-At.js";
class l extends a {
  #n;
  #t;
  #e;
  constructor(t) {
    super(t.modelName || i.gemini.modelName), this.#n = new s({ apiKey: t.apiKey });
  }
  /**
   * Creates a model session.
   * @param {Object} options - LanguageModel options.
   * @param {Object} sessionParams - Session parameters.
   * @returns {Object} The session object.
   */
  createSession(t, e) {
    return this.#e = e, this.#t = t.modelName || this.modelName, { model: this.#t, params: e };
  }
  /**
   * Generates content (non-streaming).
   * @param {Array} contents - The history + new message content.
   * @returns {Promise<{text: string, usage: number}>}
   */
  async generateContent(t) {
    const e = {
      systemInstruction: this.#e.systemInstruction,
      ...this.#e.generationConfig
    }, n = await this.#n.models.generateContent({
      model: this.#t,
      contents: t,
      config: e
    }), o = n.usageMetadata?.promptTokenCount || 0;
    return { text: n.text, usage: o };
  }
  /**
   * Generates content stream.
   * @param {Array} contents - The history + new content.
   * @returns {Promise<AsyncIterable>} Stream of chunks.
   */
  async generateContentStream(t) {
    const e = {
      systemInstruction: this.#e.systemInstruction,
      ...this.#e.generationConfig
    }, n = await this.#n.models.generateContentStream({
      model: this.#t,
      contents: t,
      config: e
    });
    return (async function* () {
      for await (const o of n)
        yield {
          text: () => o.text,
          usageMetadata: {
            totalTokenCount: o.usageMetadata?.totalTokenCount || 0
          }
        };
    })();
  }
  /**
   * Counts tokens.
   * @param {Array} contents - The content to count.
   * @returns {Promise<number>} Total tokens.
   */
  async countTokens(t) {
    const { totalTokens: e } = await this.#n.models.countTokens({
      model: this.#t,
      contents: t
    });
    return e;
  }
}
export {
  l as default
};
