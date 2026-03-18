import { B as o } from "./base-task-model-DlKdZmRM.js";
class r {
  #e;
  #t;
  constructor(e, t) {
    this.#e = e, this.#t = t;
  }
  static #n = "You are a helpful and accurate translator. Your goal is to translate the given text from the source language to the target language. Preserve the meaning, tone, and any formatting as much as possible. Do not include any explanations or extra text in your response, only the translated text itself. If you are unsure of the translation, provide the most likely one.";
  static #a = [
    {
      role: "user",
      content: `SOURCE: en
TARGET: de
TEXT: Good morning, how are you?`
    },
    {
      role: "assistant",
      content: "Guten Morgen, wie geht es Ihnen?"
    },
    {
      role: "user",
      content: `SOURCE: de
TARGET: en
TEXT: Guten Morgen, wie geht's?`
    },
    {
      role: "assistant",
      content: "Good morning, how's it going?"
    },
    {
      role: "user",
      content: `SOURCE: en
TARGET: fr
TEXT: Bonjour, comment ça va ?`
    },
    {
      role: "assistant",
      content: "Bonjour, comment ça va ?"
    },
    {
      role: "user",
      content: `SOURCE: en
TARGET: ja
TEXT: Good morning, how are you?`
    },
    {
      role: "assistant",
      content: "おはようございます、お元気ですか？"
    },
    {
      role: "user",
      content: `SOURCE: en
TARGET: zh
TEXT: Good morning, how are you?`
    },
    {
      role: "assistant",
      content: "早上好，你好吗？"
    },
    {
      role: "user",
      content: `SOURCE: ja
TARGET: en
TEXT: おはようございます、お元気ですか？`
    },
    {
      role: "assistant",
      content: "Good morning, how are you?"
    }
  ];
  buildPrompt(e) {
    return {
      systemPrompt: r.#n,
      initialPrompts: r.#a,
      userPrompt: `SOURCE: ${this.#e}
TARGET: ${this.#t}
TEXT: ${e}`
    };
  }
}
class l extends o {
  #e;
  #t;
  constructor(e, t, n, a) {
    super(e, t), this.#e = n, this.#t = a;
  }
  static availability(e) {
    if (!e || !e.sourceLanguage || !e.targetLanguage)
      throw new TypeError("sourceLanguage and targetLanguage are required");
    const t = super.baseAvailability(e);
    return t.catch(() => {
    }), t;
  }
  static create(e) {
    if (!e || !e.sourceLanguage || !e.targetLanguage)
      return Promise.reject(
        new TypeError("sourceLanguage and targetLanguage are required")
      );
    const t = this._createInternal(e);
    return t.catch(() => {
    }), t;
  }
  static async _createInternal(e) {
    this._checkContext();
    const t = this._validateLanguageTag(e.sourceLanguage), n = this._validateLanguageTag(e.targetLanguage);
    await this.ensureLanguageModel(), this._checkContext();
    const a = new r(t, n), { systemPrompt: u, initialPrompts: i } = a.buildPrompt(""), g = {
      initialPrompts: [
        { role: "system", content: u },
        ...i
      ],
      signal: e.signal,
      monitor: e.monitor
    }, c = await (this.__window || globalThis).LanguageModel.create(g), s = new this(
      c,
      a,
      t,
      n
    );
    return e.signal && e.signal.addEventListener(
      "abort",
      () => {
        s.destroy(e.signal.reason);
      },
      { once: !0 }
    ), s;
  }
  translate(e, t = {}) {
    return this._checkContext(), this._runTask(e, t);
  }
  translateStreaming(e, t = {}) {
    return this._checkContext(), this._runTaskStreaming(e, t);
  }
  get sourceLanguage() {
    return this.#e;
  }
  get targetLanguage() {
    return this.#t;
  }
  measureInputUsage(e, t = {}) {
    return super.measureInputUsage(e, t);
  }
  get inputQuota() {
    return super.inputQuota;
  }
}
o.exposeAPIGlobally(
  "Translator",
  l,
  "__FORCE_TRANSLATOR_POLYFILL__"
);
export {
  l as Translator
};
