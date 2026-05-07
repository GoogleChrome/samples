import { n as e, t } from "../chunks/defaults-B5W7MP9T.js";
import { initializeApp as n } from "firebase/app";
import { ReCaptchaEnterpriseProvider as r, initializeAppCheck as i } from "firebase/app-check";
import { GoogleAIBackend as a, InferenceMode as o, Schema as s, VertexAIBackend as c, getAI as l, getGenerativeModel as u } from "firebase/ai";
//#region backends/firebase.js
function d(e) {
	if (!e) return;
	let t = {
		description: e.description,
		nullable: e.nullable || !1,
		format: e.format
	};
	switch (Array.isArray(e.type) && e.type.includes("null") && (t.nullable = !0, e.type = e.type.find((e) => e !== "null")), e.type) {
		case "string": return e.enum && Array.isArray(e.enum) ? s.enumString({
			...t,
			enum: e.enum
		}) : s.string(t);
		case "number": return s.number(t);
		case "integer": return s.integer(t);
		case "boolean": return s.boolean(t);
		case "array": return s.array({
			...t,
			items: d(e.items)
		});
		case "object": {
			let n = {}, r = e.properties ? Object.keys(e.properties) : [];
			r.forEach((t) => {
				n[t] = d(e.properties[t]);
			});
			let i = e.required || [], a = r.filter((e) => !i.includes(e));
			return s.object({
				...t,
				properties: n,
				optionalProperties: a
			});
		}
		default: return console.warn(`Unsupported type: ${e.type}, defaulting to string.`), s.string(t);
	}
}
var f = class extends e {
	#e;
	#t;
	constructor(e) {
		let { geminiApiProvider: o, modelName: s, useAppCheck: u, reCaptchaSiteKey: d, useLimitedUseAppCheckTokens: f, ...p } = e;
		super(s || t.firebase.modelName);
		let m = n(p);
		u && d && i(m, {
			provider: new r(d),
			isTokenAutoRefreshEnabled: !0
		});
		let h = o === "vertex" ? new c() : new a();
		this.#t = l(m, {
			backend: h,
			useLimitedUseAppCheckTokens: f || !0
		});
	}
	convertSchema(e) {
		return d(e);
	}
	createSession(e, t) {
		return this.#e = u(this.#t, {
			mode: o.ONLY_IN_CLOUD,
			inCloudParams: t
		}), this.#e;
	}
	async generateContent(e) {
		let t = await this.#e.generateContent({ contents: e }), n = t.response.usageMetadata?.promptTokenCount || 0;
		return {
			text: t.response.text(),
			usage: n
		};
	}
	async generateContentStream(e) {
		return (await this.#e.generateContentStream({ contents: e })).stream;
	}
	async countTokens(e) {
		let { totalTokens: t } = await this.#e.countTokens({ contents: e });
		return t;
	}
};
//#endregion
export { f as default };
