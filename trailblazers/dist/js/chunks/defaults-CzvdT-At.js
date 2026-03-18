class r {
  /**
   * @param {string} modelName - The name of the model.
   */
  constructor(e) {
    this.modelName = e;
  }
  /**
   * Checks if the backend is available given the options.
   * @param {Object} _options - LanguageModel options.
   * @returns {string} 'available', 'unavailable', 'downloadable', or 'downloading'.
   */
  static availability(e) {
    return "available";
  }
  /**
   * Creates a model session and stores it.
   * @param {Object} _options - LanguageModel options.
   * @param {Object} _sessionParams - Parameters for the cloud or local model.
   * @param {EventTarget} [_monitorTarget] - The event target to dispatch download progress events to.
   * @returns {any} The created session object.
   */
  createSession(e, n, o) {
    throw new Error("Not implemented");
  }
  /**
   * Generates content (non-streaming).
   * @param {Array} _content - The history + new message content.
   * @returns {Promise<{text: string, usage: number}>}
   */
  async generateContent(e) {
    throw new Error("Not implemented");
  }
  /**
   * Generates content stream.
   * @param {Array} _content - The history + new content.
   * @returns {Promise<AsyncIterable>} Stream of chunks.
   */
  async generateContentStream(e) {
    throw new Error("Not implemented");
  }
  /**
   * Counts tokens.
   * @param {Array} _content - The content to count.
   * @returns {Promise<number>} Total tokens.
   */
  async countTokens(e) {
    throw new Error("Not implemented");
  }
  /**
   * Translates a standard JSON Schema into a backend-specific format.
   * @param {Object} schema - The standard JSON Schema.
   * @returns {any} The backend-specific schema.
   */
  convertSchema(e) {
    return e;
  }
}
const a = {
  firebase: { modelName: "gemini-2.5-flash-lite" },
  gemini: { modelName: "gemini-2.5-flash-lite" },
  openai: { modelName: "gpt-4o" },
  transformers: {
    modelName: "onnx-community/gemma-3-1b-it-ONNX-GQA",
    device: "webgpu",
    dtype: "q4f16"
  }
};
export {
  a as D,
  r as P
};
