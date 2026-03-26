import { n as e, t } from "../chunks/defaults-B5W7MP9T.js";
import n from "openai";
//#region backends/openai.js
var r = class extends e {
	#e;
	constructor(e) {
		super(e.modelName || t.openai.modelName), this.config = e, this.openai = new n({
			apiKey: e.apiKey,
			dangerouslyAllowBrowser: !0
		});
	}
	static availability(e = {}) {
		if (e.expectedInputs) {
			let t = e.expectedInputs.some((e) => e.type === "audio"), n = e.expectedInputs.some((e) => e.type === "image");
			if (t && n) return "unavailable";
		}
		return "available";
	}
	convertSchema(e) {
		if (typeof e != "object" || !e) return {
			schema: e,
			wrapped: !1
		};
		let t = (e) => {
			if (e.type === "object") if (e.properties) {
				e.additionalProperties = !1, e.required = Object.keys(e.properties);
				for (let n in e.properties) t(e.properties[n]);
			} else e.additionalProperties = !1, e.required = [];
			else e.type === "array" && e.items && t(e.items);
			return e;
		}, n = JSON.parse(JSON.stringify(e));
		return n.type === "object" ? {
			wrapped: !1,
			schema: t(n)
		} : {
			wrapped: !0,
			schema: {
				type: "object",
				properties: { value: n },
				required: ["value"],
				additionalProperties: !1
			}
		};
	}
	createSession(e, t) {
		this.#e = {
			model: e.modelName || this.modelName,
			systemInstruction: t.systemInstruction
		};
		let n = t.generationConfig || {};
		if (n.responseSchema) {
			let { schema: e, wrapped: t } = n.responseSchema;
			this.#e.response_format = {
				type: "json_schema",
				json_schema: {
					name: "response",
					strict: !0,
					schema: e
				}
			}, this.#e.response_wrapped = t;
		} else n.responseMimeType === "application/json" && (this.#e.response_format = { type: "json_object" });
		return this.#e;
	}
	#t(e) {
		let t = !1, n = !1;
		for (let r of e) if (Array.isArray(r.content)) for (let e of r.content) e.type === "image_url" && (t = !0), e.type === "input_audio" && (n = !0);
		if (t && n) throw Error("OpenAI backend does not support mixing images and audio in the same session. Please start a new session.");
		return {
			hasImage: t,
			hasAudio: n
		};
	}
	#n(e) {
		return this.#e.model === this.modelName ? e ? `${this.modelName}-audio-preview` : this.modelName : this.#e.model;
	}
	async generateContent(e) {
		let { messages: t } = this.#r(e, this.#e.systemInstruction), { hasAudio: n } = this.#t(t), r = this.#n(n);
		if (r === `${this.modelName}-audio-preview` && this.#e.response_format) throw new DOMException(`OpenAI audio model ('${r}') does not support structured outputs (responseConstraint).`, "NotSupportedError");
		let i = {
			model: r,
			messages: t
		};
		this.#e.temperature > 0 && (i.temperature = this.#e.temperature), this.#e.response_format && (i.response_format = this.#e.response_format);
		try {
			let e = await this.openai.chat.completions.create(i), t = e.choices[0].message.content;
			if (this.#e.response_wrapped && t) try {
				let e = JSON.parse(t);
				e && typeof e == "object" && "value" in e && (t = JSON.stringify(e.value));
			} catch {}
			let n = e.usage?.prompt_tokens || 0;
			return {
				text: t,
				usage: n
			};
		} catch (e) {
			throw console.error("OpenAI Generate Content Error:", e), e;
		}
	}
	async generateContentStream(e) {
		let { messages: t } = this.#r(e, this.#e.systemInstruction), { hasAudio: n } = this.#t(t), r = this.#n(n);
		if (r === `${this.modelName}-audio-preview` && this.#e.response_format) throw new DOMException(`OpenAI audio model ('${r}') does not support structured outputs (responseConstraint).`, "NotSupportedError");
		let i = {
			model: r,
			messages: t,
			stream: !0
		};
		this.#e.temperature > 0 && (i.temperature = this.#e.temperature), this.#e.response_format && (i.response_format = this.#e.response_format);
		try {
			let e = await this.openai.chat.completions.create(i);
			return (async function* () {
				for await (let t of e) {
					let e = t.choices[0]?.delta?.content;
					e && (yield {
						text: () => e,
						usageMetadata: { totalTokenCount: 0 }
					});
				}
			})();
		} catch (e) {
			throw console.error("OpenAI Generate Content Stream Error:", e), e;
		}
	}
	async countTokens(e) {
		let t = "";
		if (Array.isArray(e)) {
			for (let n of e) if (n.parts) for (let e of n.parts) e.text ? t += e.text : e.inlineData && (t += " ".repeat(1e3));
		}
		return Math.ceil(t.length / 4);
	}
	#r(e, t) {
		let n = [];
		t && n.push({
			role: "system",
			content: t
		});
		for (let t of e) {
			let e = t.role === "model" ? "assistant" : "user", r = [];
			for (let e of t.parts) if (e.text) r.push({
				type: "text",
				text: e.text
			});
			else if (e.inlineData) {
				let { data: t, mimeType: n } = e.inlineData;
				n.startsWith("image/") ? r.push({
					type: "image_url",
					image_url: { url: `data:${n};base64,${t}` }
				}) : n.startsWith("audio/") && r.push({
					type: "input_audio",
					input_audio: {
						data: t,
						format: n.split("/")[1] === "mpeg" ? "mp3" : "wav"
					}
				});
			}
			n.push({
				role: e,
				content: r
			});
		}
		return { messages: n };
	}
};
//#endregion
export { r as default };
