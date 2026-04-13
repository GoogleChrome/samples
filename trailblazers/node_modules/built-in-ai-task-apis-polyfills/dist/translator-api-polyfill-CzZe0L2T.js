import { t as e } from "./base-task-model-qufXegMx.js";
//#region translator-prompt-builder.js
var t = class e {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	static #n = "You are a helpful and accurate translator. Your goal is to translate the given text from the source language to the target language. Preserve the meaning, tone, and any formatting as much as possible. Do not include any explanations or extra text in your response, only the translated text itself. If you are unsure of the translation, provide the most likely one.";
	static #r = [
		{
			role: "user",
			content: "SOURCE: en\nTARGET: de\nTEXT: Good morning, how are you?"
		},
		{
			role: "assistant",
			content: "Guten Morgen, wie geht es Ihnen?"
		},
		{
			role: "user",
			content: "SOURCE: de\nTARGET: en\nTEXT: Guten Morgen, wie geht's?"
		},
		{
			role: "assistant",
			content: "Good morning, how's it going?"
		},
		{
			role: "user",
			content: "SOURCE: en\nTARGET: fr\nTEXT: Bonjour, comment ça va ?"
		},
		{
			role: "assistant",
			content: "Bonjour, comment ça va ?"
		},
		{
			role: "user",
			content: "SOURCE: en\nTARGET: ja\nTEXT: Good morning, how are you?"
		},
		{
			role: "assistant",
			content: "おはようございます、お元気ですか？"
		},
		{
			role: "user",
			content: "SOURCE: en\nTARGET: zh\nTEXT: Good morning, how are you?"
		},
		{
			role: "assistant",
			content: "早上好，你好吗？"
		},
		{
			role: "user",
			content: "SOURCE: ja\nTARGET: en\nTEXT: おはようございます、お元気ですか？"
		},
		{
			role: "assistant",
			content: "Good morning, how are you?"
		}
	];
	buildPrompt(t) {
		return {
			systemPrompt: e.#n,
			initialPrompts: e.#r,
			userPrompt: `SOURCE: ${this.#e}\nTARGET: ${this.#t}\nTEXT: ${t}`
		};
	}
}, n = class extends e {
	#e;
	#t;
	constructor(e, t, n, r) {
		super(e, t), this.#e = n, this.#t = r;
	}
	static availability(e) {
		if (!e || !e.sourceLanguage || !e.targetLanguage) throw TypeError("sourceLanguage and targetLanguage are required");
		let t = super.baseAvailability(e);
		return t.catch(() => {}), t;
	}
	static create(e) {
		if (!e || !e.sourceLanguage || !e.targetLanguage) return Promise.reject(/* @__PURE__ */ TypeError("sourceLanguage and targetLanguage are required"));
		let t = this._createInternal(e);
		return t.catch(() => {}), t;
	}
	static async _createInternal(e) {
		this._checkContext();
		let n = this._validateLanguageTag(e.sourceLanguage), r = this._validateLanguageTag(e.targetLanguage);
		await this.ensureLanguageModel(), this._checkContext();
		let i = new t(n, r), { systemPrompt: a, initialPrompts: o } = i.buildPrompt(""), s = {
			initialPrompts: [{
				role: "system",
				content: a
			}, ...o],
			signal: e.signal,
			monitor: e.monitor
		}, c = await (this.__window || globalThis).LanguageModel.create(s), l = new this(c, i, n, r);
		return e.signal && e.signal.addEventListener("abort", () => {
			l.destroy(e.signal.reason);
		}, { once: !0 }), l;
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
};
e.exposeAPIGlobally("Translator", n, "__FORCE_TRANSLATOR_POLYFILL__");
//#endregion
export { n as t };
