//#region base-task-model.js
var e = class {
	#e;
	#t;
	#n = !1;
	#r = /* @__PURE__ */ new Set();
	#i = new AbortController();
	#a = null;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	static _validateLanguageTag(e) {
		try {
			return Intl.getCanonicalLocales(e)[0];
		} catch {
			throw RangeError(`Invalid language tag: ${e}`);
		}
	}
	static _checkContext() {
		let e = this.__window || (typeof globalThis < "u" ? globalThis : null), t = !1;
		try {
			(!e || e.closed || e.document && e.document.defaultView !== e) && (t = !0);
		} catch {
			t = !0;
		}
		if (t) {
			let t;
			try {
				t = e?.DOMException || globalThis.DOMException || Error;
			} catch {
				t = globalThis.DOMException || Error;
			}
			throw new t("The execution context is not valid.", "InvalidStateError");
		}
	}
	_checkContext() {
		this.constructor._checkContext();
	}
	static baseAvailability(e = {}) {
		try {
			this._checkContext();
		} catch (e) {
			let t = Promise.reject(e);
			return t.catch(() => {}), t;
		}
		let t = (async () => {
			await this.ensureLanguageModel();
			let t = {
				expectedInputs: [{
					type: "text",
					languages: e.expectedInputLanguages || ["en"]
				}],
				expectedOutputs: [{
					type: "text",
					languages: e.outputLanguage ? [e.outputLanguage] : ["en"]
				}]
			};
			return await (this.__window || globalThis).LanguageModel.availability(t);
		})();
		return t.catch(() => {}), t;
	}
	static async ensureLanguageModel() {
		let e = this.__window || globalThis;
		e !== void 0 && !e.LanguageModel && await import("prompt-api-polyfill");
	}
	static availability(e = {}) {
		let t = (async () => {
			this._checkContext(), await this.ensureLanguageModel();
			let t = {
				expectedInputs: [{
					type: "text",
					languages: e.expectedInputLanguages || ["en"]
				}],
				expectedOutputs: [{
					type: "text",
					languages: e.outputLanguage ? [e.outputLanguage] : ["en"]
				}]
			};
			return await globalThis.LanguageModel.availability(t);
		})();
		return t.catch(() => {}), t;
	}
	_isNonTranslatable(e) {
		return typeof e == "string" && /^[\s\x00-\x1f]*$/.test(e);
	}
	_runTask(e, t = {}) {
		if (this._isNonTranslatable(e)) {
			let t = Promise.resolve(e);
			return t.catch(() => {}), t;
		}
		let n = this._runTaskInternal(e, t);
		return n.catch(() => {}), n;
	}
	async _runTaskInternal(e, t = {}) {
		if (this._checkContext(), this.#n) {
			let e = Promise.reject(this.#a || new DOMException("The summarizer has been destroyed.", "AbortError"));
			return e.catch(() => {}), e;
		}
		let { userPrompt: n } = this.#t.buildPrompt(e, t), r = AbortSignal.any([this.#i.signal, t.signal].filter(Boolean));
		if (r.aborted) {
			let e = Promise.reject(r.reason || new DOMException("Aborted", "AbortError"));
			return e.catch(() => {}), e;
		}
		let i = {
			...t,
			signal: r
		}, a = await this.#e.clone(i);
		this.#r.add(a);
		try {
			return await new Promise((e, t) => {
				let o = () => {
					t(r.reason || new DOMException("Aborted", "AbortError"));
				};
				if (r.aborted) {
					o();
					return;
				}
				r.addEventListener("abort", o, { once: !0 }), a.prompt(n, i).then(e).catch(t).finally(() => {
					r.removeEventListener("abort", o);
				});
			});
		} finally {
			a.destroy(), this.#r.delete(a);
		}
	}
	_runTaskStreaming(e, t = {}) {
		if (this._checkContext(), this._isNonTranslatable(e)) return new ReadableStream({ start(t) {
			t.enqueue(e), t.close();
		} });
		let { userPrompt: n } = this.#t.buildPrompt(e, t), r = this.#e, i = t.signal;
		if (i?.aborted) throw i.reason || new DOMException("Aborted", "AbortError");
		let a = this, o = AbortSignal.any([this.#i.signal, t.signal].filter(Boolean));
		if (o.aborted) throw o.reason || new DOMException("Aborted", "AbortError");
		return new ReadableStream({ async start(e) {
			if (a.#n) {
				e.error(a.#a || new DOMException("The summarizer has been destroyed.", "AbortError"));
				return;
			}
			let i, s, c = () => {
				s &&= (s.cancel().catch(() => {}), null), i &&= (i.destroy(), a.#r.delete(i), null);
			}, l = () => {
				i && c();
				try {
					e.error(o.reason || new DOMException("Aborted", "AbortError"));
				} catch {}
			};
			o.addEventListener("abort", l, { once: !0 });
			try {
				let c = {
					...t,
					signal: o
				};
				if (i = await r.clone(c), a.#r.add(i), o.aborted) {
					l();
					return;
				}
				for (s = i.promptStreaming(n, c).getReader();;) {
					let { done: t, value: n } = await s.read();
					if (t) break;
					e.enqueue(n);
				}
				e.close();
			} catch (t) {
				e.error(t);
			} finally {
				o.removeEventListener("abort", l), c();
			}
		} });
	}
	measureInputUsage(e, t = {}) {
		if (this._checkContext(), this.#n) {
			let e = Promise.reject(this.#a || new DOMException("The summarizer has been destroyed.", "AbortError"));
			return e.catch(() => {}), e;
		}
		let n = AbortSignal.any([this.#i.signal, t.signal].filter(Boolean));
		if (n.aborted) {
			let e = Promise.reject(n.reason || new DOMException("Aborted", "AbortError"));
			return e.catch(() => {}), e;
		}
		let r = new Promise((t, r) => {
			let i = () => r(n.reason || new DOMException("Aborted", "AbortError"));
			n.addEventListener("abort", i, { once: !0 }), this.#e.measureInputUsage(e).then(t).catch(r).finally(() => {
				n.removeEventListener("abort", i);
			});
		});
		return r.catch(() => {}), r;
	}
	get inputQuota() {
		return this.#e.inputQuota;
	}
	destroy(e) {
		if (!this.#n) {
			this.#n = !0, this.#a = e || new DOMException("The summarizer has been destroyed.", "AbortError"), this.#i.abort(this.#a);
			for (let e of this.#r) e.destroy();
			this.#r.clear(), this.#e.destroy();
		}
	}
	static exposeAPIGlobally(e, t, n) {
		if (typeof globalThis > "u" || !globalThis.document) return;
		let r = !!globalThis[n], i = (n) => {
			try {
				if (!n || n[e] && n[e].__isPolyfill) return;
				if (!(e in n) || r) {
					let r = { [e]: class extends t {} }[e];
					r.prototype[Symbol.toStringTag] = e, r.__window = n, r.__isPolyfill = !0, typeof r.create == "function" && (r.create = r.create.bind(r)), typeof r.availability == "function" && (r.availability = r.availability.bind(r)), n[e] = r, n.DOMException && (n.QuotaExceededError = n.DOMException);
				}
			} catch {}
		};
		if (i(globalThis), typeof HTMLIFrameElement < "u") try {
			let e = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow");
			e && e.get && Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
				get() {
					let t = e.get.call(this);
					return t && i(t), t;
				},
				configurable: !0
			});
		} catch {}
		let a = new MutationObserver((e) => {
			for (let t of e) for (let e of t.addedNodes) e.tagName === "IFRAME" && (i(e.contentWindow), e.addEventListener("load", () => i(e.contentWindow), { once: !1 }));
		});
		globalThis.document?.documentElement && (a.observe(globalThis.document.documentElement, {
			childList: !0,
			subtree: !0
		}), globalThis.document.querySelectorAll("iframe").forEach((e) => {
			i(e.contentWindow), e.addEventListener("load", () => i(e.contentWindow), { once: !1 });
		})), globalThis[e] && globalThis[e].__isPolyfill && console.log(`Polyfill: window.${e} is now backed by the ${e} API polyfill.`);
	}
};
//#endregion
export { e as t };
