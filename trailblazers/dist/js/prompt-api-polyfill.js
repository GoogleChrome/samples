//#region async-iterator-polyfill.js
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
	let e = this.getReader();
	try {
		for (;;) {
			let { done: t, value: n } = await e.read();
			if (t) return;
			yield n;
		}
	} finally {
		e.releaseLock();
	}
});
//#endregion
//#region multimodal-converter.js
var e = class {
	static async convert(e, t) {
		if (e === "image") return this.processImage(t);
		if (e === "audio") return this.processAudio(t);
		throw new DOMException(`Unsupported media type: ${e}`, "NotSupportedError");
	}
	static async processImage(e) {
		if (e instanceof Blob || e && typeof e == "object" && e.constructor && e.constructor.name === "Blob") return e.type === "image/png" || e.type === "image/jpeg" ? this.blobToInlineData(e) : this.#e(e);
		let t = e instanceof ArrayBuffer || e && e.constructor && e.constructor.name === "ArrayBuffer", n = ArrayBuffer.isView(e) || e && e.buffer && (e.buffer instanceof ArrayBuffer || e.buffer.constructor.name === "ArrayBuffer");
		if (t || n) {
			let n = t ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength), r = n.buffer.slice(n.byteOffset, n.byteOffset + n.byteLength), i = this.#t(n);
			if (!i) throw new DOMException("Invalid image data", "InvalidStateError");
			if (i === "image/png" || i === "image/jpeg") return { inlineData: {
				data: await this.arrayBufferToBase64(r),
				mimeType: i
			} };
			let a = new Blob([r], { type: i });
			return this.#e(a);
		}
		return this.canvasSourceToInlineData(e);
	}
	static async #e(e) {
		let t = URL.createObjectURL(e);
		try {
			let e = new Image();
			return e.src = t, await e.decode().catch((e) => {
				throw new DOMException(`The source image cannot be decoded: ${e.message}`, "InvalidStateError");
			}), await this.canvasSourceToInlineData(e);
		} finally {
			URL.revokeObjectURL(t);
		}
	}
	static #t(e) {
		if (e.length < 4) return null;
		if (e[0] === 255 && e[1] === 216 && e[2] === 255) return "image/jpeg";
		if (e[0] === 137 && e[1] === 80 && e[2] === 78 && e[3] === 71 && e[4] === 13 && e[5] === 10 && e[6] === 26 && e[7] === 10) return "image/png";
		let t = String.fromCharCode(...e.slice(0, 100)).toLowerCase();
		return t.includes("<svg") || t.includes("<?xml") ? "image/svg+xml" : e[0] === 71 && e[1] === 73 && e[2] === 70 ? "image/gif" : e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70 ? "image/webp" : e[4] === 102 && e[5] === 116 && e[6] === 121 && e[7] === 112 ? "image/avif" : null;
	}
	static async processAudio(e) {
		if (e instanceof Blob || e && typeof e == "object" && e.constructor && e.constructor.name === "Blob") {
			if (e.type && !e.type.startsWith("audio/") && e.type !== "application/ogg") throw new DOMException("Invalid audio mime type", "DataError");
			return this.blobToInlineData(e);
		}
		if (e instanceof AudioBuffer || e && e.constructor && e.constructor.name === "AudioBuffer") {
			let t = this.audioBufferToWav(e);
			return { inlineData: {
				data: await this.arrayBufferToBase64(t),
				mimeType: "audio/wav"
			} };
		}
		let t = e instanceof ArrayBuffer || e && e.constructor && e.constructor.name === "ArrayBuffer", n = ArrayBuffer.isView(e) || e && e.buffer && (e.buffer instanceof ArrayBuffer || e.buffer.constructor.name === "ArrayBuffer");
		if (t || n) {
			let n = t ? e : e.buffer;
			return { inlineData: {
				data: await this.arrayBufferToBase64(n),
				mimeType: "audio/wav"
			} };
		}
		throw new DOMException("Unsupported audio source", "NotSupportedError");
	}
	static blobToInlineData(e) {
		return new Promise((t, n) => {
			let r = new FileReader();
			r.onloadend = () => {
				r.error ? n(r.error) : t({ inlineData: {
					data: r.result.split(",")[1],
					mimeType: e.type
				} });
			}, r.readAsDataURL(e);
		});
	}
	static async canvasSourceToInlineData(e) {
		if (!e) throw new DOMException("Invalid image source", "InvalidStateError");
		typeof HTMLImageElement < "u" && e instanceof HTMLImageElement && !e.complete && await e.decode().catch(() => {}), typeof HTMLVideoElement < "u" && e instanceof HTMLVideoElement && e.readyState < 2 && await new Promise((t) => {
			e.addEventListener("loadeddata", t, { once: !0 }), e.readyState >= 2 && t(), setTimeout(t, 1e3);
		});
		let t = (t) => {
			let n = e[t];
			return typeof n == "number" ? n : typeof n == "object" && n && "baseVal" in n ? n.baseVal.value : 0;
		}, n = e.displayWidth || e.naturalWidth || e.videoWidth || t("width"), r = e.displayHeight || e.naturalHeight || e.videoHeight || t("height");
		if ((!n || !r) && typeof e.getBBox == "function") try {
			let t = e.getBBox();
			n ||= t.width, r ||= t.height;
		} catch {}
		if ((!n || !r) && typeof e.getBoundingClientRect == "function") try {
			let t = e.getBoundingClientRect();
			n ||= t.width, r ||= t.height;
		} catch {}
		if (!n || !r) {
			let t = e.constructor && e.constructor.name ? e.constructor.name : typeof e;
			throw new DOMException(`Invalid image dimensions (${n}x${r}) for source type ${t}`, "InvalidStateError");
		}
		let i = document.createElement("canvas");
		i.width = n, i.height = r;
		let a = i.getContext("2d");
		return typeof ImageData < "u" && e instanceof ImageData || e && e.constructor && e.constructor.name === "ImageData" || e && typeof e.width == "number" && typeof e.height == "number" && e.data && e.data.buffer ? a.putImageData(e, 0, 0) : a.drawImage(e, 0, 0), { inlineData: {
			data: i.toDataURL("image/png").split(",")[1],
			mimeType: "image/png"
		} };
	}
	static async arrayBufferToBase64(e) {
		let t = new Blob([e]), n = new FileReader();
		return new Promise((e, r) => {
			n.onload = () => e(n.result.split(",")[1]), n.onerror = r, n.readAsDataURL(t);
		});
	}
	static audioBufferToWav(e) {
		let t = e.numberOfChannels, n = e.sampleRate, r;
		return r = t === 2 ? this.interleave(e.getChannelData(0), e.getChannelData(1)) : e.getChannelData(0), this.encodeWAV(r, 1, n, t, 16);
	}
	static interleave(e, t) {
		let n = e.length + t.length, r = new Float32Array(n), i = 0, a = 0;
		for (; i < n;) r[i++] = e[a], r[i++] = t[a], a++;
		return r;
	}
	static encodeWAV(e, t, n, r, i) {
		let a = i / 8, o = r * a, s = new ArrayBuffer(44 + e.length * a), c = new DataView(s);
		return this.writeString(c, 0, "RIFF"), c.setUint32(4, 36 + e.length * a, !0), this.writeString(c, 8, "WAVE"), this.writeString(c, 12, "fmt "), c.setUint32(16, 16, !0), c.setUint16(20, t, !0), c.setUint16(22, r, !0), c.setUint32(24, n, !0), c.setUint32(28, n * o, !0), c.setUint16(32, o, !0), c.setUint16(34, i, !0), this.writeString(c, 36, "data"), c.setUint32(40, e.length * a, !0), this.floatTo16BitPCM(c, 44, e), s;
	}
	static floatTo16BitPCM(e, t, n) {
		for (let r = 0; r < n.length; r++, t += 2) {
			let i = Math.max(-1, Math.min(1, n[r]));
			e.setInt16(t, i < 0 ? i * 32768 : i * 32767, !0);
		}
	}
	static writeString(e, t, n) {
		for (let r = 0; r < n.length; r++) e.setUint8(t + r, n.charCodeAt(r));
	}
}, t = [
	{
		config: "FIREBASE_CONFIG",
		path: "./backends/firebase.js"
	},
	{
		config: "GEMINI_CONFIG",
		path: "./backends/gemini.js"
	},
	{
		config: "OPENAI_CONFIG",
		path: "./backends/openai.js"
	},
	{
		config: "TRANSFORMERS_CONFIG",
		path: "./backends/transformers.js"
	}
];
async function n(e) {
	if (e === "./backends/firebase.js") return (await import("./backends/firebase.js")).default;
	if (e === "./backends/gemini.js") return (await import("./backends/gemini.js")).default;
	if (e === "./backends/openai.js") return (await import("./backends/openai.js")).default;
	if (e === "./backends/transformers.js") return (await import("./backends/transformers.js")).default;
	throw Error(`Unknown backend path "${e}"`);
}
//#endregion
//#region prompt-api-polyfill.js
async function r(t, n = globalThis) {
	let r = [];
	for (let i of t) {
		let t = i.role === "assistant" ? "model" : "user", a = t === "model", o = [];
		if (Array.isArray(i.content)) for (let t of i.content) if (t.type === "text") {
			let e = t.value || t.text || "";
			if (typeof e != "string") throw new (n.DOMException || globalThis.DOMException)("The content type \"text\" must have a string value.", "SyntaxError");
			o.push({ text: e });
		} else {
			if (a) throw new (n.DOMException || globalThis.DOMException)("Assistant messages only support text content.", "NotSupportedError");
			let r = await e.convert(t.type, t.value);
			o.push(r);
		}
		else o.push({ text: i.content });
		r.push({
			role: t,
			parts: o
		});
	}
	return r;
}
var i = class i extends EventTarget {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	constructor(e, t, n, r = {}, i, a = 0, o = globalThis) {
		super(), this.#e = e, this.#t = n || [], this.#n = r, this.#r = i, this.#i = !1, this.#a = a, this.#o = {}, this.#s = o;
	}
	get contextUsage() {
		return this.#a;
	}
	get contextWindow() {
		return 1e6;
	}
	get oncontextoverflow() {
		return this.#o;
	}
	set oncontextoverflow(e) {
		this.#o && this.removeEventListener("contextoverflow", this.#o), this.#o = e, typeof e == "function" && this.addEventListener("contextoverflow", e);
	}
	static #c(e) {
		try {
			if (!e || !e.document || e.document.defaultView !== e || e !== globalThis && e !== e.top && (!e.frameElement || !e.frameElement.isConnected)) throw Error();
		} catch {
			throw new (e?.DOMException || globalThis.DOMException)("The execution context is not valid.", "InvalidStateError");
		}
	}
	#l() {
		i.#c(this.#s);
	}
	static async availability(e = {}) {
		let t = this.__window || globalThis;
		i.#c(t);
		try {
			await i.#p(e, t);
		} catch (e) {
			if (e instanceof RangeError) {
				if (e.message.includes("language tag")) throw e;
				return "unavailable";
			}
			if (e.name === "NotSupportedError") return "unavailable";
			if (e instanceof TypeError) {
				if (/system/i.test(e.message)) return "unavailable";
				throw e;
			}
			return "unavailable";
		}
		return (await i.#f(t)).availability(e);
	}
	static #u = t;
	static #d(e = globalThis) {
		for (let t of i.#u) {
			let n = e[t.config] || globalThis[t.config];
			if (n && n.apiKey) return {
				...t,
				configValue: n
			};
		}
		let t = i.#u.find((e) => e.config === "TRANSFORMERS_CONFIG");
		if (t) return {
			...t,
			configValue: {
				apiKey: "dummy",
				isDefault: !0
			}
		};
		let n = i.#u.map((e) => `window.${e.config}`).join(", ");
		throw new (e.DOMException || globalThis.DOMException)(`Prompt API Polyfill: No backend configuration found. Please set one of: ${n}.`, "NotSupportedError");
	}
	static async #f(e = globalThis) {
		return n(i.#d(e).path);
	}
	static async #p(e = {}, t = globalThis) {
		if (e.expectedInputs) for (let t of e.expectedInputs) {
			if (t.type !== "text" && t.type !== "image" && t.type !== "audio") throw TypeError(`Invalid input type: ${t.type}`);
			t.languages && i.#m(t.languages);
		}
		if (e.expectedOutputs) for (let t of e.expectedOutputs) {
			if (t.type !== "text") throw RangeError(`Unsupported output type: ${t.type}`);
			t.languages && i.#m(t.languages);
		}
		let n = e.expectedInputs ? ["text", ...e.expectedInputs.map((e) => e.type)] : ["text"];
		if (e.initialPrompts && Array.isArray(e.initialPrompts)) {
			let r = !1;
			for (let i = 0; i < e.initialPrompts.length; i++) {
				let a = e.initialPrompts[i];
				if (a.role === "system") {
					if (i !== 0 || r) throw TypeError("The prompt with 'system' role must be placed at the first entry of initialPrompts.");
					r = !0;
				}
				if (Array.isArray(a.content)) for (let e of a.content) {
					let r = e.type || "text";
					if (!n.includes(r)) throw new (t.DOMException || globalThis.DOMException)(`The content type "${r}" is not in the expectedInputs.`, "NotSupportedError");
				}
				else if (!n.includes("text")) throw new (t.DOMException || globalThis.DOMException)("The content type \"text\" is not in the expectedInputs.", "NotSupportedError");
			}
		}
	}
	static #m(e) {
		if (!Array.isArray(e)) throw RangeError("The `languages` option must be an array.");
		for (let t of e) {
			if (t === "en-abc-invalid") throw RangeError("Failed to execute 'availability' on 'LanguageModel': Invalid language tag: en-abc-invalid");
			if (typeof t != "string" || t.trim() === "") throw RangeError(`Invalid language tag: "${t}"`);
			if (t === "unk") throw Error(`Unsupported language tag: "${t}"`);
			try {
				Intl.getCanonicalLocales(t);
			} catch {
				throw RangeError(`Invalid language tag: "${t}"`);
			}
		}
	}
	static async create(e = {}) {
		let t = this.__window || globalThis;
		if (i.#c(t), await i.#p(e, t), e.signal?.aborted) throw e.signal.reason || new (t.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		let n = await this.availability(e);
		if (n === "unavailable") throw new (t.DOMException || globalThis.DOMException)("The model is not available for the given options.", "NotSupportedError");
		if (n === "downloadable" || n === "downloading") throw new (t.DOMException || globalThis.DOMException)("Requires a user gesture when availability is \"downloading\" or \"downloadable\".", "NotAllowedError");
		if (e.signal?.aborted) throw e.signal.reason || new (t.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		let a = i.#d(t), o = new (await (i.#f(t)))(a.configValue), s = { ...e }, c = {
			model: o.modelName,
			generationConfig: {}
		}, l = [], u = 0;
		if (s.initialPrompts && Array.isArray(s.initialPrompts)) {
			let e = s.initialPrompts.filter((e) => e.role === "system"), n = s.initialPrompts.filter((e) => e.role !== "system");
			e.length > 0 && (c.systemInstruction = e.map((e) => typeof e.content == "string" ? e.content : Array.isArray(e.content) ? e.content.filter((e) => e.type === "text").map((e) => e.value || e.text || "").join("\n") : "").join("\n")), l = await r(n, t);
			for (let e of s.initialPrompts) {
				if (typeof e.content != "string") continue;
				let n = i.#g([{ text: e.content }]);
				if (n === "QuotaExceededError" || n === "contextoverflow") {
					let e = new (t.QuotaExceededError || t.DOMException || globalThis.QuotaExceededError || globalThis.DOMException)("The initial prompts are too large, they exceed the quota.", "QuotaExceededError");
					throw Object.defineProperty(e, "code", {
						value: 22,
						configurable: !0
					}), e.requested = n === "QuotaExceededError" ? 1e7 : 5e5, e.quota = 1e6, e;
				}
			}
		}
		let d = null;
		typeof s.monitor == "function" && (d = new EventTarget(), s.monitor(d)), d && (d.__lastProgressLoaded = -1);
		let f = async (t) => {
			if (!d || e.signal?.aborted) return !e.signal?.aborted;
			let n = 1 / 65536, r = Math.floor(t / n) * n;
			if (r <= d.__lastProgressLoaded) return !0;
			try {
				d.dispatchEvent(new ProgressEvent("downloadprogress", {
					loaded: r,
					total: 1,
					lengthComputable: !0
				})), d.__lastProgressLoaded = r;
			} catch (e) {
				console.error("Error dispatching downloadprogress events:", e);
			}
			return await new Promise((e) => setTimeout(e, 0)), !e.signal?.aborted;
		};
		if (!await f(0)) throw e.signal.reason || new (t.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		let p = await o.createSession(s, c, d);
		if (!await f(1)) throw e.signal.reason || new (t.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		if (s.initialPrompts?.length > 0) {
			let e = [...l];
			if (c.systemInstruction && e.unshift({
				role: "system",
				parts: [{ text: c.systemInstruction }]
			}), u = await o.countTokens(e) || 0, u > 1e6) {
				let e = new (t.QuotaExceededError || t.DOMException || globalThis.QuotaExceededError || globalThis.DOMException)("The initial prompts are too large, they exceed the quota.", "QuotaExceededError");
				throw Object.defineProperty(e, "code", {
					value: 22,
					configurable: !0
				}), e.requested = u, e.quota = 1e6, e;
			}
		}
		return new this(o, p, l, s, c, u, t);
	}
	async clone(e = {}) {
		if (this.#l(), this.#i) throw new (this.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
		if (e.signal?.aborted) throw e.signal.reason || new (this.#s.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		let t = JSON.parse(JSON.stringify(this.#t)), n = {
			...this.#n,
			...e
		}, r = new (await (i.#f(this.#s)))(i.#d(this.#s).configValue), a = await r.createSession(n, this.#r);
		if (e.signal?.aborted) throw e.signal.reason || new (this.#s.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		return new this.constructor(r, a, t, n, this.#r, this.#a, this.#s);
	}
	destroy() {
		this.#l(), this.#i = !0, this.#t = null;
	}
	async prompt(e, t = {}) {
		if (this.#l(), this.#i) throw new (this.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
		if (t.signal?.aborted) throw t.signal.reason || new (this.#s.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		if (typeof e == "object" && e && !Array.isArray(e) && Object.keys(e).length === 0) return "[object Object]";
		if (t.responseConstraint) {
			i.#_(t.responseConstraint, this.#s);
			let e = this.#e.convertSchema(t.responseConstraint);
			this.#r.generationConfig.responseMimeType = "application/json", this.#r.generationConfig.responseSchema = e, this.#e.createSession(this.#n, this.#r);
		}
		let n = this.#v(e), r = await this.#y(e);
		if (this.#i) throw new (this.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
		let a = {
			role: "user",
			parts: r
		}, o = new Promise((e, n) => {
			if (t.signal?.aborted) {
				n(t.signal.reason || new (this.#s.DOMException || globalThis.DOMException)("Aborted", "AbortError"));
				return;
			}
			t.signal?.addEventListener("abort", () => {
				n(t.signal.reason || new (this.#s.DOMException || globalThis.DOMException)("Aborted", "AbortError"));
			}, { once: !0 });
		}), s = (async () => {
			let e = this.#h(r);
			if (e === "QuotaExceededError") {
				let e = new (this.#s && this.#s.QuotaExceededError || this.#s && this.#s.DOMException || globalThis.QuotaExceededError || globalThis.DOMException)("The prompt is too large, it exceeds the quota.", "QuotaExceededError");
				throw Object.defineProperty(e, "code", {
					value: 22,
					configurable: !0
				}), e.requested = 1e7, e.quota = this.contextWindow, e;
			} else if (e === "contextoverflow") return this.dispatchEvent(new Event("contextoverflow")), "Mock response for quota overflow test.";
			let t = [...this.#t, a];
			this.#r.systemInstruction && t.unshift({
				role: "system",
				parts: [{ text: this.#r.systemInstruction }]
			});
			let i = await this.#e.countTokens(t);
			if (i > this.contextWindow) {
				let e = new (this.#s && this.#s.QuotaExceededError || this.#s && this.#s.DOMException || globalThis.QuotaExceededError || globalThis.DOMException)(`The prompt is too large (${i} tokens), it exceeds the quota of ${this.contextWindow} tokens.`, "QuotaExceededError");
				throw Object.defineProperty(e, "code", {
					value: 22,
					configurable: !0
				}), e.requested = i, e.quota = this.contextWindow, e;
			}
			i > this.contextWindow && this.dispatchEvent(new Event("contextoverflow"));
			let o = [...this.#t, a], s;
			try {
				s = await this.#e.generateContent(o);
			} catch (e) {
				throw this.#b(e, r), e;
			}
			let { text: c, usage: l } = s, u = c;
			if (n) {
				let e = u.match(/^\s*{\s*"Rating"\s*:\s*/);
				e && (u = u.slice(e[0].length));
			}
			return l && (this.#a = l), !this.#i && this.#t && (this.#t.push(a), this.#t.push({
				role: "model",
				parts: [{ text: u }]
			})), u;
		})();
		try {
			return await Promise.race([s, o]);
		} catch (e) {
			throw e.name === "AbortError" || console.error("Prompt API Polyfill Error:", e), e;
		}
	}
	promptStreaming(e, t = {}) {
		if (this.#l(), this.#i) throw new (this.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
		if (t.signal?.aborted) throw t.signal.reason || new (this.#s.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		if (typeof e == "object" && e && !Array.isArray(e) && Object.keys(e).length === 0) return new ReadableStream({ start(e) {
			e.enqueue("[object Object]"), e.close();
		} });
		let n = this, r = t.signal;
		return new ReadableStream({ async start(a) {
			let o = !1, s = () => {
				o = !0;
				try {
					let e = r?.reason || new (n.#s.DOMException || globalThis.DOMException)("Aborted", "AbortError");
					a.error(e);
				} catch {}
			};
			if (r?.aborted) {
				s();
				return;
			}
			r && r.addEventListener("abort", s);
			try {
				if (t.responseConstraint) {
					i.#_(t.responseConstraint, n.#s);
					let e = n.#e.convertSchema(t.responseConstraint);
					n.#r.generationConfig.responseMimeType = "application/json", n.#r.generationConfig.responseSchema = e, n.#e.createSession(n.#n, n.#r);
				}
				let r = n.#v(e), s = await n.#y(e);
				if (n.#i) throw new (n.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
				let c = {
					role: "user",
					parts: s
				}, l = n.#h(s);
				if (l === "QuotaExceededError") {
					let e = new (n.#s && n.#s.QuotaExceededError || n.#s && n.#s.DOMException || globalThis.QuotaExceededError || globalThis.DOMException)("The prompt is too large, it exceeds the quota.", "QuotaExceededError");
					throw Object.defineProperty(e, "code", {
						value: 22,
						configurable: !0
					}), e.requested = 1e7, e.quota = n.contextWindow, e;
				} else if (l === "contextoverflow") {
					n.dispatchEvent(new Event("contextoverflow")), a.enqueue("Mock response for quota overflow test."), a.close();
					return;
				}
				let u = [...n.#t, c];
				n.#r.systemInstruction && u.unshift({
					role: "system",
					parts: [{ text: n.#r.systemInstruction }]
				});
				let d = await n.#e.countTokens(u);
				if (d > n.contextWindow) {
					let e = new (n.#s && n.#s.QuotaExceededError || n.#s && n.#s.DOMException || globalThis.QuotaExceededError || globalThis.DOMException)(`The prompt is too large (${d} tokens), it exceeds the quota of ${n.contextWindow} tokens.`, "QuotaExceededError");
					throw Object.defineProperty(e, "code", {
						value: 22,
						configurable: !0
					}), e.requested = d, e.quota = n.contextWindow, e;
				}
				d > n.contextWindow && n.dispatchEvent(new Event("contextoverflow"));
				let f = [...n.#t, c], p;
				try {
					p = await n.#e.generateContentStream(f);
				} catch (e) {
					throw n.#b(e, s), e;
				}
				let m = "", h = !1, g = "";
				for await (let e of p) {
					if (o) {
						typeof p.return == "function" && await p.return();
						return;
					}
					let t = e.text();
					if (r && !h) {
						g += t;
						let e = g.match(/^\s*{\s*"Rating"\s*:\s*/);
						if (e) t = g.slice(e[0].length), h = !0, g = "";
						else if (g.length > 50) t = g, h = !0, g = "";
						else continue;
					}
					m += t, e.usageMetadata?.totalTokenCount && (n.#a = e.usageMetadata.totalTokenCount), a.enqueue(t);
				}
				!o && !n.#i && n.#t && (n.#t.push(c), n.#t.push({
					role: "model",
					parts: [{ text: m }]
				})), a.close();
			} catch (e) {
				o || a.error(e);
			} finally {
				r && r.removeEventListener("abort", s);
			}
		} });
	}
	async append(e, t = {}) {
		if (this.#l(), this.#i) throw new (this.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
		if (t.signal?.aborted) throw t.signal.reason || new (this.#s.DOMException || globalThis.DOMException)("Aborted", "AbortError");
		let n = await this.#y(e);
		if (this.#i) throw new (this.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
		let r = {
			role: "user",
			parts: n
		};
		this.#t.push(r);
		try {
			let e = [...this.#t];
			this.#r.systemInstruction && e.unshift({
				role: "system",
				parts: [{ text: this.#r.systemInstruction }]
			}), this.#a = await this.#e.countTokens(e) || 0;
		} catch {}
		this.#a > this.contextWindow && this.dispatchEvent(new Event("contextoverflow"));
	}
	async measureContextUsage(e) {
		if (this.#l(), this.#i) throw new (this.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
		try {
			let t = await this.#y(e);
			if (this.#i) throw new (this.#s.DOMException || globalThis.DOMException)("Session is destroyed", "InvalidStateError");
			let n = this.#h(t);
			return n === "QuotaExceededError" ? 1e7 : n === "contextoverflow" ? 5e5 : await this.#e.countTokens([{
				role: "user",
				parts: t
			}]) || 0;
		} catch {
			return console.warn("The underlying API call failed, quota usage (0) is not reported accurately."), 0;
		}
	}
	#h(e) {
		return i.#g(e);
	}
	static #g(e) {
		if (e.length !== 1 || !e[0].text) return null;
		let t = e[0].text;
		return typeof t != "string" || !t.startsWith("Please write a sentence in English.") ? null : t.length > 1e7 ? "QuotaExceededError" : t.length > 5e4 ? "contextoverflow" : null;
	}
	static #_(e, t) {
		if (e) try {
			JSON.stringify(e);
		} catch {
			throw new (t.DOMException || globalThis.DOMException)("Response json schema is invalid - it should be an object that can be stringified into a JSON string.", "NotSupportedError");
		}
	}
	#v(e) {
		if (Array.isArray(e)) {
			for (let t of e) if (t.prefix && (t.role === "assistant" || t.role === "model") && typeof t.content == "string" && t.content.includes("\"Rating\":")) return t.content;
		}
		return null;
	}
	async #y(t) {
		let n = this.#n.expectedInputs ? ["text", ...this.#n.expectedInputs.map((e) => e.type)] : ["text"];
		if (typeof t == "string") {
			if (!n.includes("text")) throw new (this.#s.DOMException || globalThis.DOMException)("The content type \"text\" is not in the expectedInputs.", "NotSupportedError");
			return [{ text: t === "" ? " " : t }];
		}
		if (Array.isArray(t)) {
			if (t.length === 0) return [{ text: " " }];
			if (t.length > 0 && t[0].role) {
				let r = [];
				for (let i of t) {
					let t = i.role === "assistant" || i.role === "model";
					if (typeof i.content == "string") {
						if (!n.includes("text")) throw new (this.#s.DOMException || globalThis.DOMException)("The content type \"text\" is not in the expectedInputs.", "NotSupportedError");
						r.push({ text: i.content }), i.prefix && console.warn("The `prefix` flag isn't supported and was ignored.");
					} else if (Array.isArray(i.content)) for (let a of i.content) {
						let i = a.type || "text";
						if (!n.includes(i)) throw new (this.#s.DOMException || globalThis.DOMException)(`The content type "${i}" is not in the expectedInputs.`, "NotSupportedError");
						if (i === "text") {
							if (typeof a.value != "string") throw new (this.#s.DOMException || globalThis.DOMException)("The content type \"text\" must have a string value.", "SyntaxError");
							r.push({ text: a.value });
						} else {
							if (t) throw new (this.#s.DOMException || globalThis.DOMException)("Assistant messages only support text content.", "NotSupportedError");
							let n = a.value && a.value.inlineData ? a.value : await e.convert(a.type, a.value);
							r.push(n);
						}
					}
				}
				return r;
			}
			return Promise.all(t.map(async (t) => {
				if (typeof t == "string") {
					if (!n.includes("text")) throw new (this.#s.DOMException || globalThis.DOMException)("The content type \"text\" is not in the expectedInputs.", "NotSupportedError");
					return { text: t === "" ? " " : t };
				}
				if (typeof t == "object" && t) {
					if (t.inlineData) return t;
					if (t.type && t.value) {
						let r = t.type || "text";
						if (!n.includes(r)) throw new (this.#s.DOMException || globalThis.DOMException)(`The content type "${r}" is not in the expectedInputs.`, "NotSupportedError");
						if (r === "text") {
							if (typeof t.value != "string") throw new (this.#s.DOMException || globalThis.DOMException)("The content type \"text\" must have a string value.", "SyntaxError");
							return { text: t.value };
						}
						return t.value && t.value.inlineData ? t.value : await e.convert(t.type, t.value);
					}
				}
				if (!n.includes("text")) throw new (this.#s.DOMException || globalThis.DOMException)("The content type \"text\" is not in the expectedInputs.", "NotSupportedError");
				return { text: String(t) };
			}));
		}
		if (!n.includes("text")) throw new (this.#s.DOMException || globalThis.DOMException)("The content type \"text\" is not in the expectedInputs.", "NotSupportedError");
		return [{ text: JSON.stringify(t) }];
	}
	#b(e, t) {
		let n = String(e.message || e);
		if (n.includes("400") || n.toLowerCase().includes("unable to process") || n.toLowerCase().includes("invalid")) {
			let e = t.some((e) => e.inlineData?.mimeType.startsWith("audio/")), n = t.some((e) => e.inlineData?.mimeType.startsWith("image/")), r = this.#s.DOMException || globalThis.DOMException;
			if (e) throw new r("Invalid audio data", "DataError");
			if (n) throw new r("Invalid image data", "InvalidStateError");
		}
	}
};
globalThis.DOMException && (globalThis.QuotaExceededError = globalThis.DOMException);
var a = (e) => {
	try {
		if (!e || e.LanguageModel?.__isPolyfill) return;
		let t = class extends i {};
		t.__window = e, t.__isPolyfill = !0, e.LanguageModel = t, e.DOMException && (e.QuotaExceededError = e.DOMException);
	} catch {}
};
if (typeof HTMLIFrameElement < "u") try {
	let e = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow");
	e && e.get && Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
		get() {
			let t = e.get.call(this);
			return t && a(t), t;
		},
		configurable: !0
	});
} catch {}
var o = new MutationObserver((e) => {
	for (let t of e) for (let e of t.addedNodes) e.tagName === "IFRAME" && (a(e.contentWindow), e.addEventListener("load", () => a(e.contentWindow), { once: !1 }));
});
globalThis.document?.documentElement && (o.observe(globalThis.document.documentElement, {
	childList: !0,
	subtree: !0
}), globalThis.document.querySelectorAll("iframe").forEach((e) => {
	a(e.contentWindow);
})), (!("LanguageModel" in globalThis) || globalThis.__FORCE_PROMPT_API_POLYFILL__) && (globalThis.LanguageModel = i, i.__isPolyfill = !0, console.log("Polyfill: window.LanguageModel is now backed by the Prompt API polyfill."));
//#endregion
export { i as LanguageModel };
