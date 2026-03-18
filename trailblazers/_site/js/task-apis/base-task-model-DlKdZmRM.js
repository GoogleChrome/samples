class p {
  #e;
  #s;
  #n = !1;
  #t = /* @__PURE__ */ new Set();
  #r = new AbortController();
  #o = null;
  constructor(e, o) {
    this.#e = e, this.#s = o;
  }
  static _validateLanguageTag(e) {
    try {
      return Intl.getCanonicalLocales(e)[0];
    } catch {
      throw new RangeError(`Invalid language tag: ${e}`);
    }
  }
  static _checkContext() {
    const e = this.__window || (typeof globalThis < "u" ? globalThis : null);
    let o = !1;
    try {
      (!e || e.closed || e.document && e.document.defaultView !== e) && (o = !0);
    } catch {
      o = !0;
    }
    if (o) {
      let r;
      try {
        r = e?.DOMException || globalThis.DOMException || Error;
      } catch {
        r = globalThis.DOMException || Error;
      }
      throw new r("The execution context is not valid.", "InvalidStateError");
    }
  }
  _checkContext() {
    this.constructor._checkContext();
  }
  static baseAvailability(e = {}) {
    try {
      this._checkContext();
    } catch (r) {
      const s = Promise.reject(r);
      return s.catch(() => {
      }), s;
    }
    const o = (async () => {
      await this.ensureLanguageModel();
      const r = {
        expectedInputs: [
          {
            type: "text",
            languages: e.expectedInputLanguages || ["en"]
          }
        ],
        expectedOutputs: [
          {
            type: "text",
            languages: e.outputLanguage ? [e.outputLanguage] : ["en"]
          }
        ]
      };
      return await (this.__window || globalThis).LanguageModel.availability(r);
    })();
    return o.catch(() => {
    }), o;
  }
  static async ensureLanguageModel() {
    const e = this.__window || globalThis;
    typeof e < "u" && !e.LanguageModel && await import("prompt-api-polyfill");
  }
  static availability(e = {}) {
    const o = (async () => {
      this._checkContext(), await this.ensureLanguageModel();
      const r = {
        expectedInputs: [
          {
            type: "text",
            languages: e.expectedInputLanguages || ["en"]
          }
        ],
        expectedOutputs: [
          {
            type: "text",
            languages: e.outputLanguage ? [e.outputLanguage] : ["en"]
          }
        ]
      };
      return await globalThis.LanguageModel.availability(r);
    })();
    return o.catch(() => {
    }), o;
  }
  _isNonTranslatable(e) {
    return typeof e == "string" && /^[\s\x00-\x1f]*$/.test(e);
  }
  _runTask(e, o = {}) {
    if (this._isNonTranslatable(e)) {
      const s = Promise.resolve(e);
      return s.catch(() => {
      }), s;
    }
    const r = this._runTaskInternal(e, o);
    return r.catch(() => {
    }), r;
  }
  async _runTaskInternal(e, o = {}) {
    if (this._checkContext(), this.#n) {
      const t = Promise.reject(
        this.#o || new DOMException("The summarizer has been destroyed.", "AbortError")
      );
      return t.catch(() => {
      }), t;
    }
    const { userPrompt: r } = this.#s.buildPrompt(e, o), s = AbortSignal.any(
      [this.#r.signal, o.signal].filter(Boolean)
    );
    if (s.aborted) {
      const t = Promise.reject(
        s.reason || new DOMException("Aborted", "AbortError")
      );
      return t.catch(() => {
      }), t;
    }
    const a = { ...o, signal: s }, c = await this.#e.clone(a);
    this.#t.add(c);
    try {
      return await new Promise((t, n) => {
        const i = () => {
          n(
            s.reason || new DOMException("Aborted", "AbortError")
          );
        };
        if (s.aborted) {
          i();
          return;
        }
        s.addEventListener("abort", i, { once: !0 }), c.prompt(r, a).then(t).catch(n).finally(() => {
          s.removeEventListener("abort", i);
        });
      });
    } finally {
      c.destroy(), this.#t.delete(c);
    }
  }
  _runTaskStreaming(e, o = {}) {
    if (this._checkContext(), this._isNonTranslatable(e))
      return new ReadableStream({
        start(n) {
          n.enqueue(e), n.close();
        }
      });
    const { userPrompt: r } = this.#s.buildPrompt(e, o), s = this.#e, a = o.signal;
    if (a?.aborted)
      throw a.reason || new DOMException("Aborted", "AbortError");
    const c = this, t = AbortSignal.any(
      [this.#r.signal, o.signal].filter(Boolean)
    );
    if (t.aborted)
      throw t.reason || new DOMException("Aborted", "AbortError");
    return new ReadableStream({
      async start(n) {
        if (c.#n) {
          n.error(
            c.#o || new DOMException(
              "The summarizer has been destroyed.",
              "AbortError"
            )
          );
          return;
        }
        let i, l;
        const h = () => {
          l && (l.cancel().catch(() => {
          }), l = null), i && (i.destroy(), c.#t.delete(i), i = null);
        }, u = () => {
          i && h();
          try {
            n.error(
              t.reason || new DOMException("Aborted", "AbortError")
            );
          } catch {
          }
        };
        t.addEventListener("abort", u, { once: !0 });
        try {
          const d = { ...o, signal: t };
          if (i = await s.clone(d), c.#t.add(i), t.aborted) {
            u();
            return;
          }
          for (l = i.promptStreaming(
            r,
            d
          ).getReader(); ; ) {
            const { done: b, value: g } = await l.read();
            if (b)
              break;
            n.enqueue(g);
          }
          n.close();
        } catch (d) {
          n.error(d);
        } finally {
          t.removeEventListener("abort", u), h();
        }
      }
    });
  }
  measureInputUsage(e, o = {}) {
    if (this._checkContext(), this.#n) {
      const a = Promise.reject(
        this.#o || new DOMException("The summarizer has been destroyed.", "AbortError")
      );
      return a.catch(() => {
      }), a;
    }
    const r = AbortSignal.any(
      [this.#r.signal, o.signal].filter(Boolean)
    );
    if (r.aborted) {
      const a = Promise.reject(
        r.reason || new DOMException("Aborted", "AbortError")
      );
      return a.catch(() => {
      }), a;
    }
    const s = new Promise((a, c) => {
      const t = () => c(
        r.reason || new DOMException("Aborted", "AbortError")
      );
      r.addEventListener("abort", t, {
        once: !0
      }), this.#e.measureInputUsage(e).then(a).catch(c).finally(() => {
        r.removeEventListener("abort", t);
      });
    });
    return s.catch(() => {
    }), s;
  }
  get inputQuota() {
    return this.#e.inputQuota;
  }
  destroy(e) {
    if (!this.#n) {
      this.#n = !0, this.#o = e || new DOMException("The summarizer has been destroyed.", "AbortError"), this.#r.abort(this.#o);
      for (const o of this.#t)
        o.destroy();
      this.#t.clear(), this.#e.destroy();
    }
  }
  /**
   * Helper to expose an API globally and auto-inject it into iframes.
   * @param {string} apiName The name of the API (e.g., 'Summarizer')
   * @param {function} apiClass The API class to expose
   * @param {string} forceFlag The name of the force flag (e.g., '__FORCE_SUMMARIZER_POLYFILL__')
   */
  static exposeAPIGlobally(e, o, r) {
    if (typeof globalThis > "u" || !globalThis.document)
      return;
    const s = !!globalThis[r], a = (t) => {
      try {
        if (!t || t[e] && t[e].__isPolyfill)
          return;
        if (!(e in t) || s) {
          const n = { [e]: class extends o {
          } }[e];
          n.prototype[Symbol.toStringTag] = e, n.__window = t, n.__isPolyfill = !0, typeof n.create == "function" && (n.create = n.create.bind(n)), typeof n.availability == "function" && (n.availability = n.availability.bind(n)), t[e] = n, t.DOMException && (t.QuotaExceededError = t.DOMException);
        }
      } catch {
      }
    };
    if (a(globalThis), typeof HTMLIFrameElement < "u")
      try {
        const t = Object.getOwnPropertyDescriptor(
          HTMLIFrameElement.prototype,
          "contentWindow"
        );
        t && t.get && Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
          get() {
            const n = t.get.call(this);
            return n && a(n), n;
          },
          configurable: !0
        });
      } catch {
      }
    const c = new MutationObserver((t) => {
      for (const n of t)
        for (const i of n.addedNodes)
          i.tagName === "IFRAME" && (a(i.contentWindow), i.addEventListener("load", () => a(i.contentWindow), {
            once: !1
          }));
    });
    globalThis.document?.documentElement && (c.observe(globalThis.document.documentElement, {
      childList: !0,
      subtree: !0
    }), globalThis.document.querySelectorAll("iframe").forEach((t) => {
      a(t.contentWindow), t.addEventListener("load", () => a(t.contentWindow), {
        once: !1
      });
    })), globalThis[e] && globalThis[e].__isPolyfill && console.log(
      `Polyfill: window.${e} is now backed by the ${e} API polyfill.`
    );
  }
}
export {
  p as B
};
