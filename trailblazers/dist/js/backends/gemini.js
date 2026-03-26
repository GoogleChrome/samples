import { n as e, t } from "../chunks/defaults-B5W7MP9T.js";
import { GoogleGenAI as n } from "@google/genai";
//#region backends/gemini.js
var r = class extends e {
	#e;
	#t;
	#n;
	constructor(e) {
		super(e.modelName || t.gemini.modelName), this.#e = new n({ apiKey: e.apiKey });
	}
	createSession(e, t) {
		return this.#n = t, this.#t = e.modelName || this.modelName, {
			model: this.#t,
			params: t
		};
	}
	async generateContent(e) {
		let t = {
			systemInstruction: this.#n.systemInstruction,
			...this.#n.generationConfig
		}, n = await this.#e.models.generateContent({
			model: this.#t,
			contents: e,
			config: t
		}), r = n.usageMetadata?.promptTokenCount || 0;
		return {
			text: n.text,
			usage: r
		};
	}
	async generateContentStream(e) {
		let t = {
			systemInstruction: this.#n.systemInstruction,
			...this.#n.generationConfig
		}, n = await this.#e.models.generateContentStream({
			model: this.#t,
			contents: e,
			config: t
		});
		return (async function* () {
			for await (let e of n) yield {
				text: () => e.text,
				usageMetadata: { totalTokenCount: e.usageMetadata?.totalTokenCount || 0 }
			};
		})();
	}
	async countTokens(e) {
		let { totalTokens: t } = await this.#e.models.countTokens({
			model: this.#t,
			contents: e
		});
		return t;
	}
};
//#endregion
export { r as default };
