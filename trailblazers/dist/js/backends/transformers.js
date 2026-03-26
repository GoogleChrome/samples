import { n as e, t } from "../chunks/defaults-B5W7MP9T.js";
import { TextStreamer as n, env as r, pipeline as i } from "@huggingface/transformers";
//#region backends/transformers.js
var a = class extends e {
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(e = {}) {
		if (super(e.modelName || t.transformers.modelName), this.#n = e.device || t.transformers.device || "webgpu", this.#r = e.dtype || t.transformers.dtype || "q4f16", e.isDefault && console.log(`Polyfill: No backend configuration found. Defaulting to Transformers.js with model: ${this.modelName}`), r.experimental_useCrossOriginStorage = !0, e.env) {
			let t = (e, n) => {
				for (let [r, i] of Object.entries(n)) i && typeof i == "object" && !Array.isArray(i) && e[r] && typeof e[r] == "object" ? t(e[r], i) : e[r] = i;
			};
			t(r, e.env);
		}
	}
	async #a(e) {
		if (!this.#e) {
			let t = (t) => {
				if (!e) return;
				let n = 1 / 65536, r = Math.floor(t / n) * n;
				r <= e.__lastProgressLoaded || (e.dispatchEvent(new ProgressEvent("downloadprogress", {
					loaded: r,
					total: 1,
					lengthComputable: !0
				})), e.__lastProgressLoaded = r);
			};
			t(0), this.#e = await i("text-generation", this.modelName, {
				device: this.#n,
				dtype: this.#r,
				progress_callback: (e) => {
					e.status === "progress_total" ? t(e.progress / 100) : e.status === "ready" && t(1);
				}
			}), this.#t = this.#e.tokenizer;
		}
		return this.#e;
	}
	static availability(e) {
		if (e?.expectedInputs && Array.isArray(e.expectedInputs)) {
			for (let t of e.expectedInputs) if (t.type === "audio" || t.type === "image") return "unavailable";
		}
		return "available";
	}
	async createSession(e, t, n) {
		return await this.#a(n), this.generationConfig = {
			max_new_tokens: 512,
			do_sample: !1,
			return_full_text: !1
		}, this.#i = t.systemInstruction, this.responseSchema = t.generationConfig?.responseSchema, this.responseSchema && console.warn("Polyfill: `responseConstraint` is not natively supported by the Transformers.js backend and is implemented via prompt engineering, which may fail. For better results, consider adding few-shot examples to your prompt."), this.#e;
	}
	async generateContent(e) {
		let t = await this.#a(), n = this.#o(e);
		return {
			text: (await t(this.#t.apply_chat_template(n, {
				tokenize: !1,
				add_generation_prompt: !0
			}), {
				...this.generationConfig,
				add_special_tokens: !1
			}))[0].generated_text,
			usage: await this.countTokens(e)
		};
	}
	async generateContentStream(e) {
		let t = await this.#a(), r = this.#o(e), i = this.#t.apply_chat_template(r, {
			tokenize: !1,
			add_generation_prompt: !0
		}), a = [], o, s = new Promise((e) => o = e), c = !1, l = new n(this.#t, {
			skip_prompt: !0,
			skip_special_tokens: !0,
			callback_function: (e) => {
				a.push(e), o &&= (o(), null);
			}
		});
		return t(i, {
			...this.generationConfig,
			add_special_tokens: !1,
			streamer: l
		}).then(() => {
			c = !0, o &&= (o(), null);
		}).catch((e) => {
			console.error("[Transformers.js] Generation error:", e), c = !0, o &&= (o(), null);
		}), (async function* () {
			for (;;) {
				for (a.length === 0 && !c && (o || (s = new Promise((e) => o = e)), await s); a.length > 0;) {
					let e = a.shift();
					yield {
						text: () => e,
						usageMetadata: { totalTokenCount: 0 }
					};
				}
				if (c) break;
			}
		})();
	}
	async countTokens(e) {
		await this.#a();
		let t = this.#o(e);
		return this.#t.apply_chat_template(t, {
			tokenize: !0,
			add_generation_prompt: !1,
			return_tensor: !1
		}).length;
	}
	#o(e) {
		let t = e.map((e) => ({
			role: e.role === "model" ? "assistant" : e.role === "system" ? "system" : "user",
			content: e.parts.map((e) => e.text).join("")
		}));
		if (this.#i && !t.some((e) => e.role === "system") && t.unshift({
			role: "system",
			content: this.#i
		}), this.#s(t), this.modelName.toLowerCase().includes("gemma")) {
			let e = t.findIndex((e) => e.role === "system");
			if (e !== -1) {
				let n = t[e], r = t.findIndex((t, n) => t.role === "user" && n > e);
				r === -1 ? (n.content += "\n\n", n.role = "user") : (t[r].content = n.content + "\n\n" + t[r].content, t.splice(e, 1));
			}
		}
		return t;
	}
	#s(e) {
		if (this.responseSchema) {
			let t = `Respond ONLY with a raw JSON object matching this JSON Schema:

\`\`\`json
${JSON.stringify(this.responseSchema, null, 2)}
\`\`\`

DO NOT include Markdown code blocks, explanations, or any other text.`;
			e.length > 0 && e[0].role === "system" ? e[0].content = t + "\n\n" + e[0].content : e.unshift({
				role: "system",
				content: t
			});
		}
	}
};
//#endregion
export { a as default };
