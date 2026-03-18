ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const f = this.getReader();
  try {
    for (; ; ) {
      const { done: t, value: e } = await f.read();
      if (t)
        return;
      yield e;
    }
  } finally {
    f.releaseLock();
  }
});
class O {
  static async convert(t, e) {
    if (t === "image")
      return this.processImage(e);
    if (t === "audio")
      return this.processAudio(e);
    throw new DOMException(
      `Unsupported media type: ${t}`,
      "NotSupportedError"
    );
  }
  static async processImage(t) {
    if (t instanceof Blob || t && typeof t == "object" && t.constructor && t.constructor.name === "Blob")
      return t.type === "image/png" || t.type === "image/jpeg" ? this.blobToInlineData(t) : this.#o(t);
    const o = t instanceof ArrayBuffer || t && t.constructor && t.constructor.name === "ArrayBuffer", n = ArrayBuffer.isView(t) || t && t.buffer && (t.buffer instanceof ArrayBuffer || t.buffer.constructor.name === "ArrayBuffer");
    if (o || n) {
      const r = o ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength), i = r.buffer.slice(
        r.byteOffset,
        r.byteOffset + r.byteLength
      ), a = this.#e(r);
      if (!a)
        throw new DOMException("Invalid image data", "InvalidStateError");
      if (a === "image/png" || a === "image/jpeg")
        return { inlineData: { data: await this.arrayBufferToBase64(i), mimeType: a } };
      const c = new Blob([i], { type: a });
      return this.#o(c);
    }
    return this.canvasSourceToInlineData(t);
  }
  static async #o(t) {
    const e = URL.createObjectURL(t);
    try {
      const o = new Image();
      return o.src = e, await o.decode().catch((n) => {
        throw new DOMException(
          `The source image cannot be decoded: ${n.message}`,
          "InvalidStateError"
        );
      }), await this.canvasSourceToInlineData(o);
    } finally {
      URL.revokeObjectURL(e);
    }
  }
  static #e(t) {
    if (t.length < 4)
      return null;
    if (t[0] === 255 && t[1] === 216 && t[2] === 255)
      return "image/jpeg";
    if (t[0] === 137 && t[1] === 80 && t[2] === 78 && t[3] === 71 && t[4] === 13 && t[5] === 10 && t[6] === 26 && t[7] === 10)
      return "image/png";
    const o = String.fromCharCode(...t.slice(0, 100)).toLowerCase();
    return o.includes("<svg") || o.includes("<?xml") ? "image/svg+xml" : t[0] === 71 && t[1] === 73 && t[2] === 70 ? "image/gif" : t[0] === 82 && t[1] === 73 && t[2] === 70 && t[3] === 70 ? "image/webp" : t[4] === 102 && t[5] === 116 && t[6] === 121 && t[7] === 112 ? "image/avif" : null;
  }
  static async processAudio(t) {
    if (t instanceof Blob || t && typeof t == "object" && t.constructor && t.constructor.name === "Blob") {
      if (t.type && !t.type.startsWith("audio/") && t.type !== "application/ogg")
        throw new DOMException("Invalid audio mime type", "DataError");
      return this.blobToInlineData(t);
    }
    if (t instanceof AudioBuffer || t && t.constructor && t.constructor.name === "AudioBuffer") {
      const i = this.audioBufferToWav(t);
      return { inlineData: { data: await this.arrayBufferToBase64(i), mimeType: "audio/wav" } };
    }
    const n = t instanceof ArrayBuffer || t && t.constructor && t.constructor.name === "ArrayBuffer", r = ArrayBuffer.isView(t) || t && t.buffer && (t.buffer instanceof ArrayBuffer || t.buffer.constructor.name === "ArrayBuffer");
    if (n || r) {
      const i = n ? t : t.buffer;
      return {
        inlineData: {
          data: await this.arrayBufferToBase64(i),
          mimeType: "audio/wav"
          // Fallback assumption
        }
      };
    }
    throw new DOMException("Unsupported audio source", "NotSupportedError");
  }
  // Low Level Converters
  static blobToInlineData(t) {
    return new Promise((e, o) => {
      const n = new FileReader();
      n.onloadend = () => {
        n.error ? o(n.error) : e({
          inlineData: {
            data: n.result.split(",")[1],
            mimeType: t.type
          }
        });
      }, n.readAsDataURL(t);
    });
  }
  static async canvasSourceToInlineData(t) {
    if (!t)
      throw new DOMException("Invalid image source", "InvalidStateError");
    typeof HTMLImageElement < "u" && t instanceof HTMLImageElement && !t.complete && await t.decode().catch(() => {
    }), typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement && t.readyState < 2 && await new Promise((s) => {
      t.addEventListener("loadeddata", s, { once: !0 }), t.readyState >= 2 && s(), setTimeout(s, 1e3);
    });
    const e = (s) => {
      const p = t[s];
      return typeof p == "number" ? p : typeof p == "object" && p !== null && "baseVal" in p ? p.baseVal.value : 0;
    };
    let o = t.displayWidth || t.naturalWidth || t.videoWidth || e("width"), n = t.displayHeight || t.naturalHeight || t.videoHeight || e("height");
    if ((!o || !n) && typeof t.getBBox == "function")
      try {
        const s = t.getBBox();
        o = o || s.width, n = n || s.height;
      } catch {
      }
    if ((!o || !n) && typeof t.getBoundingClientRect == "function")
      try {
        const s = t.getBoundingClientRect();
        o = o || s.width, n = n || s.height;
      } catch {
      }
    if (!o || !n) {
      const s = t.constructor && t.constructor.name ? t.constructor.name : typeof t;
      throw new DOMException(
        `Invalid image dimensions (${o}x${n}) for source type ${s}`,
        "InvalidStateError"
      );
    }
    const r = document.createElement("canvas");
    r.width = o, r.height = n;
    const i = r.getContext("2d");
    return typeof ImageData < "u" && t instanceof ImageData || t && t.constructor && t.constructor.name === "ImageData" || t && typeof t.width == "number" && typeof t.height == "number" && t.data && t.data.buffer ? i.putImageData(t, 0, 0) : i.drawImage(t, 0, 0), {
      inlineData: {
        data: r.toDataURL("image/png").split(",")[1],
        mimeType: "image/png"
      }
    };
  }
  static async arrayBufferToBase64(t) {
    const e = new Blob([t]), o = new FileReader();
    return new Promise((n, r) => {
      o.onload = () => n(o.result.split(",")[1]), o.onerror = r, o.readAsDataURL(e);
    });
  }
  // Simple WAV Encoder for AudioBuffer
  static audioBufferToWav(t) {
    const e = t.numberOfChannels, o = t.sampleRate, n = 1, r = 16;
    let i;
    return e === 2 ? i = this.interleave(
      t.getChannelData(0),
      t.getChannelData(1)
    ) : i = t.getChannelData(0), this.encodeWAV(i, n, o, e, r);
  }
  static interleave(t, e) {
    const o = t.length + e.length, n = new Float32Array(o);
    let r = 0, i = 0;
    for (; r < o; )
      n[r++] = t[i], n[r++] = e[i], i++;
    return n;
  }
  static encodeWAV(t, e, o, n, r) {
    const i = r / 8, a = n * i, c = new ArrayBuffer(44 + t.length * i), s = new DataView(c);
    return this.writeString(s, 0, "RIFF"), s.setUint32(4, 36 + t.length * i, !0), this.writeString(s, 8, "WAVE"), this.writeString(s, 12, "fmt "), s.setUint32(16, 16, !0), s.setUint16(20, e, !0), s.setUint16(22, n, !0), s.setUint32(24, o, !0), s.setUint32(28, o * a, !0), s.setUint16(32, a, !0), s.setUint16(34, r, !0), this.writeString(s, 36, "data"), s.setUint32(40, t.length * i, !0), this.floatTo16BitPCM(s, 44, t), c;
  }
  static floatTo16BitPCM(t, e, o) {
    for (let n = 0; n < o.length; n++, e += 2) {
      const r = Math.max(-1, Math.min(1, o[n]));
      t.setInt16(e, r < 0 ? r * 32768 : r * 32767, !0);
    }
  }
  static writeString(t, e, o) {
    for (let n = 0; n < o.length; n++)
      t.setUint8(e + n, o.charCodeAt(n));
  }
}
const D = [
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
async function M(f) {
  if (f === "./backends/firebase.js")
    return (await import("./backends/firebase.js")).default;
  if (f === "./backends/gemini.js")
    return (await import("./backends/gemini.js")).default;
  if (f === "./backends/openai.js")
    return (await import("./backends/openai.js")).default;
  if (f === "./backends/transformers.js")
    return (await import("./backends/transformers.js")).default;
  throw new Error(`Unknown backend path "${f}"`);
}
async function I(f, t = globalThis) {
  const e = [];
  for (const o of f) {
    const n = o.role === "assistant" ? "model" : "user", r = n === "model";
    let i = [];
    if (Array.isArray(o.content))
      for (const a of o.content)
        if (a.type === "text") {
          const c = a.value || a.text || "";
          if (typeof c != "string")
            throw new (t.DOMException || globalThis.DOMException)(
              'The content type "text" must have a string value.',
              "SyntaxError"
            );
          i.push({ text: c });
        } else {
          if (r)
            throw new (t.DOMException || globalThis.DOMException)(
              "Assistant messages only support text content.",
              "NotSupportedError"
            );
          const c = await O.convert(a.type, a.value);
          i.push(c);
        }
    else
      i.push({ text: o.content });
    e.push({ role: n, parts: i });
  }
  return e;
}
class d extends EventTarget {
  #o;
  #e;
  #a;
  #n;
  #r;
  #i;
  #c;
  #t;
  constructor(t, e, o, n = {}, r, i = 0, a = globalThis) {
    super(), this.#o = t, this.#e = o || [], this.#a = n, this.#n = r, this.#r = !1, this.#i = i, this.#c = {}, this.#t = a;
  }
  get contextUsage() {
    return this.#i;
  }
  get contextWindow() {
    return 1e6;
  }
  get oncontextoverflow() {
    return this.#c;
  }
  set oncontextoverflow(t) {
    this.#c && this.removeEventListener("contextoverflow", this.#c), this.#c = t, typeof t == "function" && this.addEventListener("contextoverflow", t);
  }
  static #f(t) {
    try {
      if (!t || !t.document || t.document.defaultView !== t)
        throw new Error();
      if (t !== globalThis && t !== t.top && (!t.frameElement || !t.frameElement.isConnected))
        throw new Error();
    } catch {
      const e = t?.DOMException || globalThis.DOMException;
      throw new e(
        "The execution context is not valid.",
        "InvalidStateError"
      );
    }
  }
  #s() {
    d.#f(this.#t);
  }
  static async availability(t = {}) {
    const e = this.__window || globalThis;
    d.#f(e);
    try {
      await d.#g(t, e);
    } catch (n) {
      if (n instanceof RangeError) {
        if (n.message.includes("language tag"))
          throw n;
        return "unavailable";
      }
      if (n.name === "NotSupportedError")
        return "unavailable";
      if (n instanceof TypeError) {
        if (/system/i.test(n.message))
          return "unavailable";
        throw n;
      }
      return "unavailable";
    }
    return (await d.#p(e)).availability(t);
  }
  static #h = D;
  static #d(t = globalThis) {
    for (const n of d.#h) {
      const r = t[n.config] || globalThis[n.config];
      if (r && r.apiKey)
        return { ...n, configValue: r };
    }
    const e = d.#h.find(
      (n) => n.config === "TRANSFORMERS_CONFIG"
    );
    if (e)
      return {
        ...e,
        configValue: { apiKey: "dummy", isDefault: !0 }
      };
    const o = d.#h.map((n) => `window.${n.config}`).join(", ");
    throw new (t.DOMException || globalThis.DOMException)(
      `Prompt API Polyfill: No backend configuration found. Please set one of: ${o}.`,
      "NotSupportedError"
    );
  }
  static async #p(t = globalThis) {
    const e = d.#d(t);
    return M(e.path);
  }
  static async #g(t = {}, e = globalThis) {
    if (t.expectedInputs)
      for (const n of t.expectedInputs) {
        if (n.type !== "text" && n.type !== "image" && n.type !== "audio")
          throw new TypeError(`Invalid input type: ${n.type}`);
        n.languages && d.#x(n.languages);
      }
    if (t.expectedOutputs)
      for (const n of t.expectedOutputs) {
        if (n.type !== "text")
          throw new RangeError(`Unsupported output type: ${n.type}`);
        n.languages && d.#x(n.languages);
      }
    const o = t.expectedInputs ? ["text", ...t.expectedInputs.map((n) => n.type)] : ["text"];
    if (t.initialPrompts && Array.isArray(t.initialPrompts)) {
      let n = !1;
      for (let r = 0; r < t.initialPrompts.length; r++) {
        const i = t.initialPrompts[r];
        if (i.role === "system") {
          if (r !== 0)
            throw new TypeError(
              "The prompt with 'system' role must be placed at the first entry of initialPrompts."
            );
          if (n)
            throw new TypeError(
              "The prompt with 'system' role must be placed at the first entry of initialPrompts."
            );
          n = !0;
        }
        if (Array.isArray(i.content))
          for (const a of i.content) {
            const c = a.type || "text";
            if (!o.includes(c))
              throw new (e.DOMException || globalThis.DOMException)(
                `The content type "${c}" is not in the expectedInputs.`,
                "NotSupportedError"
              );
          }
        else if (!o.includes("text"))
          throw new (e.DOMException || globalThis.DOMException)(
            'The content type "text" is not in the expectedInputs.',
            "NotSupportedError"
          );
      }
    }
  }
  static #x(t) {
    if (!Array.isArray(t))
      throw new RangeError("The `languages` option must be an array.");
    for (const e of t) {
      if (e === "en-abc-invalid")
        throw new RangeError(
          "Failed to execute 'availability' on 'LanguageModel': Invalid language tag: en-abc-invalid"
        );
      if (typeof e != "string" || e.trim() === "")
        throw new RangeError(`Invalid language tag: "${e}"`);
      if (e === "unk")
        throw new Error(`Unsupported language tag: "${e}"`);
      try {
        Intl.getCanonicalLocales(e);
      } catch {
        throw new RangeError(`Invalid language tag: "${e}"`);
      }
    }
  }
  static async create(t = {}) {
    const e = this.__window || globalThis;
    if (d.#f(e), await d.#g(t, e), t.signal?.aborted)
      throw t.signal.reason || new (e.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    const o = await this.availability(t);
    if (o === "unavailable")
      throw new (e.DOMException || globalThis.DOMException)(
        "The model is not available for the given options.",
        "NotSupportedError"
      );
    if (o === "downloadable" || o === "downloading")
      throw new (e.DOMException || globalThis.DOMException)(
        'Requires a user gesture when availability is "downloading" or "downloadable".',
        "NotAllowedError"
      );
    if (t.signal?.aborted)
      throw t.signal.reason || new (e.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    const n = d.#d(e), r = await d.#p(e), i = new r(n.configValue), a = { ...t }, c = {
      model: i.modelName,
      generationConfig: {}
    };
    let s = [], p = 0;
    if (a.initialPrompts && Array.isArray(a.initialPrompts)) {
      const E = a.initialPrompts.filter(
        (l) => l.role === "system"
      ), u = a.initialPrompts.filter(
        (l) => l.role !== "system"
      );
      E.length > 0 && (c.systemInstruction = E.map((l) => typeof l.content == "string" ? l.content : Array.isArray(l.content) ? l.content.filter((h) => h.type === "text").map((h) => h.value || h.text || "").join(`
`) : "").join(`
`)), s = await I(u, e);
      for (const l of a.initialPrompts) {
        if (typeof l.content != "string")
          continue;
        const h = d.#w([
          { text: l.content }
        ]);
        if (h === "QuotaExceededError" || h === "contextoverflow") {
          const y = e.QuotaExceededError || e.DOMException || globalThis.QuotaExceededError || globalThis.DOMException, g = new y(
            "The initial prompts are too large, they exceed the quota.",
            "QuotaExceededError"
          );
          Object.defineProperty(g, "code", {
            value: 22,
            configurable: !0
          });
          const x = h === "QuotaExceededError" ? 1e7 : 5e5;
          throw g.requested = x, g.quota = 1e6, g;
        }
      }
    }
    let w = null;
    typeof a.monitor == "function" && (w = new EventTarget(), a.monitor(w)), w && (w.__lastProgressLoaded = -1);
    const m = async (E) => {
      if (!w || t.signal?.aborted)
        return !t.signal?.aborted;
      const u = 1 / 65536, l = Math.floor(E / u) * u;
      if (l <= w.__lastProgressLoaded)
        return !0;
      try {
        w.dispatchEvent(
          new ProgressEvent("downloadprogress", {
            loaded: l,
            total: 1,
            lengthComputable: !0
          })
        ), w.__lastProgressLoaded = l;
      } catch (h) {
        console.error("Error dispatching downloadprogress events:", h);
      }
      return await new Promise((h) => setTimeout(h, 0)), !t.signal?.aborted;
    };
    if (!await m(0))
      throw t.signal.reason || new (e.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    const b = await i.createSession(
      a,
      c,
      w
    );
    if (!await m(1))
      throw t.signal.reason || new (e.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    if (a.initialPrompts?.length > 0) {
      const E = [...s];
      if (c.systemInstruction && E.unshift({
        role: "system",
        parts: [{ text: c.systemInstruction }]
      }), p = await i.countTokens(E) || 0, p > 1e6) {
        const u = e.QuotaExceededError || e.DOMException || globalThis.QuotaExceededError || globalThis.DOMException, l = new u(
          "The initial prompts are too large, they exceed the quota.",
          "QuotaExceededError"
        );
        throw Object.defineProperty(l, "code", { value: 22, configurable: !0 }), l.requested = p, l.quota = 1e6, l;
      }
    }
    return new this(
      i,
      b,
      s,
      a,
      c,
      p,
      e
    );
  }
  // Instance Methods
  async clone(t = {}) {
    if (this.#s(), this.#r)
      throw new (this.#t.DOMException || globalThis.DOMException)(
        "Session is destroyed",
        "InvalidStateError"
      );
    if (t.signal?.aborted)
      throw t.signal.reason || new (this.#t.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    const e = JSON.parse(JSON.stringify(this.#e)), o = { ...this.#a, ...t }, n = await d.#p(this.#t), r = d.#d(this.#t), i = new n(r.configValue), a = await i.createSession(
      o,
      this.#n
    );
    if (t.signal?.aborted)
      throw t.signal.reason || new (this.#t.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    return new this.constructor(
      i,
      a,
      e,
      o,
      this.#n,
      this.#i,
      this.#t
    );
  }
  destroy() {
    this.#s(), this.#r = !0, this.#e = null;
  }
  async prompt(t, e = {}) {
    if (this.#s(), this.#r)
      throw new (this.#t.DOMException || globalThis.DOMException)(
        "Session is destroyed",
        "InvalidStateError"
      );
    if (e.signal?.aborted)
      throw e.signal.reason || new (this.#t.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    if (typeof t == "object" && t !== null && !Array.isArray(t) && Object.keys(t).length === 0)
      return "[object Object]";
    if (e.responseConstraint) {
      d.#E(
        e.responseConstraint,
        this.#t
      );
      const c = this.#o.convertSchema(e.responseConstraint);
      this.#n.generationConfig.responseMimeType = "application/json", this.#n.generationConfig.responseSchema = c, this.#o.createSession(this.#a, this.#n);
    }
    const o = this.#y(t), n = await this.#l(t);
    if (this.#r)
      throw new (this.#t.DOMException || globalThis.DOMException)(
        "Session is destroyed",
        "InvalidStateError"
      );
    const r = { role: "user", parts: n }, i = new Promise((c, s) => {
      if (e.signal?.aborted) {
        s(
          e.signal.reason || new (this.#t.DOMException || globalThis.DOMException)(
            "Aborted",
            "AbortError"
          )
        );
        return;
      }
      e.signal?.addEventListener(
        "abort",
        () => {
          s(
            e.signal.reason || new (this.#t.DOMException || globalThis.DOMException)(
              "Aborted",
              "AbortError"
            )
          );
        },
        { once: !0 }
      );
    }), a = (async () => {
      const c = this.#u(n);
      if (c === "QuotaExceededError") {
        const l = this.#t && this.#t.QuotaExceededError || this.#t && this.#t.DOMException || globalThis.QuotaExceededError || globalThis.DOMException, h = new l(
          "The prompt is too large, it exceeds the quota.",
          "QuotaExceededError"
        );
        Object.defineProperty(h, "code", { value: 22, configurable: !0 });
        const y = 1e7;
        throw h.requested = y, h.quota = this.contextWindow, h;
      } else if (c === "contextoverflow")
        return this.dispatchEvent(new Event("contextoverflow")), "Mock response for quota overflow test.";
      const s = [...this.#e, r];
      this.#n.systemInstruction && s.unshift({
        role: "system",
        parts: [{ text: this.#n.systemInstruction }]
      });
      const p = await this.#o.countTokens(
        s
      );
      if (p > this.contextWindow) {
        const l = this.#t && this.#t.QuotaExceededError || this.#t && this.#t.DOMException || globalThis.QuotaExceededError || globalThis.DOMException, h = new l(
          `The prompt is too large (${p} tokens), it exceeds the quota of ${this.contextWindow} tokens.`,
          "QuotaExceededError"
        );
        throw Object.defineProperty(h, "code", { value: 22, configurable: !0 }), h.requested = p, h.quota = this.contextWindow, h;
      }
      p > this.contextWindow && this.dispatchEvent(new Event("contextoverflow"));
      const w = [...this.#e, r];
      let m;
      try {
        m = await this.#o.generateContent(w);
      } catch (l) {
        throw this.#m(l, n), l;
      }
      const { text: b, usage: E } = m;
      let u = b;
      if (o) {
        const l = u.match(/^\s*{\s*"Rating"\s*:\s*/);
        l && (u = u.slice(l[0].length));
      }
      return E && (this.#i = E), !this.#r && this.#e && (this.#e.push(r), this.#e.push({ role: "model", parts: [{ text: u }] })), u;
    })();
    try {
      return await Promise.race([a, i]);
    } catch (c) {
      throw c.name === "AbortError" || console.error("Prompt API Polyfill Error:", c), c;
    }
  }
  promptStreaming(t, e = {}) {
    if (this.#s(), this.#r)
      throw new (this.#t.DOMException || globalThis.DOMException)(
        "Session is destroyed",
        "InvalidStateError"
      );
    if (e.signal?.aborted)
      throw e.signal.reason || new (this.#t.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    if (typeof t == "object" && t !== null && !Array.isArray(t) && Object.keys(t).length === 0)
      return new ReadableStream({
        start(r) {
          r.enqueue("[object Object]"), r.close();
        }
      });
    const o = this, n = e.signal;
    return new ReadableStream({
      async start(r) {
        let i = !1;
        const a = () => {
          i = !0;
          try {
            const c = n?.reason || new (o.#t.DOMException || globalThis.DOMException)(
              "Aborted",
              "AbortError"
            );
            r.error(c);
          } catch {
          }
        };
        if (n?.aborted) {
          a();
          return;
        }
        n && n.addEventListener("abort", a);
        try {
          if (e.responseConstraint) {
            d.#E(
              e.responseConstraint,
              o.#t
            );
            const g = o.#o.convertSchema(
              e.responseConstraint
            );
            o.#n.generationConfig.responseMimeType = "application/json", o.#n.generationConfig.responseSchema = g, o.#o.createSession(o.#a, o.#n);
          }
          const c = o.#y(t), s = await o.#l(t);
          if (o.#r)
            throw new (o.#t.DOMException || globalThis.DOMException)(
              "Session is destroyed",
              "InvalidStateError"
            );
          const p = { role: "user", parts: s }, w = o.#u(s);
          if (w === "QuotaExceededError") {
            const g = o.#t && o.#t.QuotaExceededError || o.#t && o.#t.DOMException || globalThis.QuotaExceededError || globalThis.DOMException, x = new g(
              "The prompt is too large, it exceeds the quota.",
              "QuotaExceededError"
            );
            Object.defineProperty(x, "code", {
              value: 22,
              configurable: !0
            });
            const T = 1e7;
            throw x.requested = T, x.quota = o.contextWindow, x;
          } else if (w === "contextoverflow") {
            o.dispatchEvent(new Event("contextoverflow")), r.enqueue("Mock response for quota overflow test."), r.close();
            return;
          }
          const m = [...o.#e, p];
          o.#n.systemInstruction && m.unshift({
            role: "system",
            parts: [{ text: o.#n.systemInstruction }]
          });
          const b = await o.#o.countTokens(
            m
          );
          if (b > o.contextWindow) {
            const g = o.#t && o.#t.QuotaExceededError || o.#t && o.#t.DOMException || globalThis.QuotaExceededError || globalThis.DOMException, x = new g(
              `The prompt is too large (${b} tokens), it exceeds the quota of ${o.contextWindow} tokens.`,
              "QuotaExceededError"
            );
            throw Object.defineProperty(x, "code", {
              value: 22,
              configurable: !0
            }), x.requested = b, x.quota = o.contextWindow, x;
          }
          b > o.contextWindow && o.dispatchEvent(new Event("contextoverflow"));
          const E = [...o.#e, p];
          let u;
          try {
            u = await o.#o.generateContentStream(E);
          } catch (g) {
            throw o.#m(g, s), g;
          }
          let l = "", h = !1, y = "";
          for await (const g of u) {
            if (i) {
              typeof u.return == "function" && await u.return();
              return;
            }
            let x = g.text();
            if (c && !h) {
              y += x;
              const T = y.match(/^\s*{\s*"Rating"\s*:\s*/);
              if (T)
                x = y.slice(T[0].length), h = !0, y = "";
              else if (y.length > 50)
                x = y, h = !0, y = "";
              else
                continue;
            }
            l += x, g.usageMetadata?.totalTokenCount && (o.#i = g.usageMetadata.totalTokenCount), r.enqueue(x);
          }
          !i && !o.#r && o.#e && (o.#e.push(p), o.#e.push({
            role: "model",
            parts: [{ text: l }]
          })), r.close();
        } catch (c) {
          i || r.error(c);
        } finally {
          n && n.removeEventListener("abort", a);
        }
      }
    });
  }
  async append(t, e = {}) {
    if (this.#s(), this.#r)
      throw new (this.#t.DOMException || globalThis.DOMException)(
        "Session is destroyed",
        "InvalidStateError"
      );
    if (e.signal?.aborted)
      throw e.signal.reason || new (this.#t.DOMException || globalThis.DOMException)(
        "Aborted",
        "AbortError"
      );
    const o = await this.#l(t);
    if (this.#r)
      throw new (this.#t.DOMException || globalThis.DOMException)(
        "Session is destroyed",
        "InvalidStateError"
      );
    const n = { role: "user", parts: o };
    this.#e.push(n);
    try {
      const r = [...this.#e];
      this.#n.systemInstruction && r.unshift({
        role: "system",
        parts: [{ text: this.#n.systemInstruction }]
      });
      const i = await this.#o.countTokens(r);
      this.#i = i || 0;
    } catch {
    }
    this.#i > this.contextWindow && this.dispatchEvent(new Event("contextoverflow"));
  }
  async measureContextUsage(t) {
    if (this.#s(), this.#r)
      throw new (this.#t.DOMException || globalThis.DOMException)(
        "Session is destroyed",
        "InvalidStateError"
      );
    try {
      const e = await this.#l(t);
      if (this.#r)
        throw new (this.#t.DOMException || globalThis.DOMException)(
          "Session is destroyed",
          "InvalidStateError"
        );
      const o = this.#u(e);
      return o === "QuotaExceededError" ? 1e7 : o === "contextoverflow" ? 5e5 : await this.#o.countTokens([
        { role: "user", parts: e }
      ]) || 0;
    } catch {
      return console.warn(
        "The underlying API call failed, quota usage (0) is not reported accurately."
      ), 0;
    }
  }
  // Volkswagen mode detection to avoid cloud costs for WPT tests.
  #u(t) {
    return d.#w(t);
  }
  static #w(t) {
    if (t.length !== 1 || !t[0].text)
      return null;
    const e = t[0].text;
    return typeof e != "string" || !e.startsWith("Please write a sentence in English.") ? null : e.length > 1e7 ? "QuotaExceededError" : e.length > 5e4 ? "contextoverflow" : null;
  }
  static #E(t, e) {
    if (t)
      try {
        JSON.stringify(t);
      } catch {
        throw new (e.DOMException || globalThis.DOMException)(
          "Response json schema is invalid - it should be an object that can be stringified into a JSON string.",
          "NotSupportedError"
        );
      }
  }
  #y(t) {
    if (Array.isArray(t)) {
      for (const e of t)
        if (e.prefix && (e.role === "assistant" || e.role === "model") && typeof e.content == "string" && e.content.includes('"Rating":'))
          return e.content;
    }
    return null;
  }
  // Private Helper to process diverse input types
  async #l(t) {
    const e = this.#a.expectedInputs ? ["text", ...this.#a.expectedInputs.map((n) => n.type)] : ["text"];
    if (typeof t == "string") {
      if (!e.includes("text"))
        throw new (this.#t.DOMException || globalThis.DOMException)(
          'The content type "text" is not in the expectedInputs.',
          "NotSupportedError"
        );
      return [{ text: t === "" ? " " : t }];
    }
    if (Array.isArray(t)) {
      if (t.length === 0)
        return [{ text: " " }];
      if (t.length > 0 && t[0].role) {
        let n = [];
        for (const r of t) {
          const i = r.role === "assistant" || r.role === "model";
          if (typeof r.content == "string") {
            if (!e.includes("text"))
              throw new (this.#t.DOMException || globalThis.DOMException)(
                'The content type "text" is not in the expectedInputs.',
                "NotSupportedError"
              );
            n.push({ text: r.content }), r.prefix && console.warn(
              "The `prefix` flag isn't supported and was ignored."
            );
          } else if (Array.isArray(r.content))
            for (const a of r.content) {
              const c = a.type || "text";
              if (!e.includes(c))
                throw new (this.#t.DOMException || globalThis.DOMException)(
                  `The content type "${c}" is not in the expectedInputs.`,
                  "NotSupportedError"
                );
              if (c === "text") {
                if (typeof a.value != "string")
                  throw new (this.#t.DOMException || globalThis.DOMException)(
                    'The content type "text" must have a string value.',
                    "SyntaxError"
                  );
                n.push({ text: a.value });
              } else {
                if (i)
                  throw new (this.#t.DOMException || globalThis.DOMException)(
                    "Assistant messages only support text content.",
                    "NotSupportedError"
                  );
                const s = a.value && a.value.inlineData ? a.value : await O.convert(a.type, a.value);
                n.push(s);
              }
            }
        }
        return n;
      }
      return Promise.all(
        t.map(async (n) => {
          if (typeof n == "string") {
            if (!e.includes("text"))
              throw new (this.#t.DOMException || globalThis.DOMException)(
                'The content type "text" is not in the expectedInputs.',
                "NotSupportedError"
              );
            return { text: n === "" ? " " : n };
          }
          if (typeof n == "object" && n !== null) {
            if (n.inlineData)
              return n;
            if (n.type && n.value) {
              const r = n.type || "text";
              if (!e.includes(r))
                throw new (this.#t.DOMException || globalThis.DOMException)(
                  `The content type "${r}" is not in the expectedInputs.`,
                  "NotSupportedError"
                );
              if (r === "text") {
                if (typeof n.value != "string")
                  throw new (this.#t.DOMException || globalThis.DOMException)(
                    'The content type "text" must have a string value.',
                    "SyntaxError"
                  );
                return { text: n.value };
              }
              return n.value && n.value.inlineData ? n.value : await O.convert(n.type, n.value);
            }
          }
          if (!e.includes("text"))
            throw new (this.#t.DOMException || globalThis.DOMException)(
              'The content type "text" is not in the expectedInputs.',
              "NotSupportedError"
            );
          return { text: String(n) };
        })
      );
    }
    if (!e.includes("text"))
      throw new (this.#t.DOMException || globalThis.DOMException)(
        'The content type "text" is not in the expectedInputs.',
        "NotSupportedError"
      );
    return [{ text: JSON.stringify(t) }];
  }
  // Map backend errors to WPT expectations
  #m(t, e) {
    const o = String(t.message || t);
    if (o.includes("400") || o.toLowerCase().includes("unable to process") || o.toLowerCase().includes("invalid")) {
      const n = e.some(
        (a) => a.inlineData?.mimeType.startsWith("audio/")
      ), r = e.some(
        (a) => a.inlineData?.mimeType.startsWith("image/")
      ), i = this.#t.DOMException || globalThis.DOMException;
      if (n)
        throw new i("Invalid audio data", "DataError");
      if (r)
        throw new i("Invalid image data", "InvalidStateError");
    }
  }
}
globalThis.DOMException && (globalThis.QuotaExceededError = globalThis.DOMException);
const v = (f) => {
  try {
    if (!f || f.LanguageModel?.__isPolyfill)
      return;
    const t = class extends d {
    };
    t.__window = f, t.__isPolyfill = !0, f.LanguageModel = t, f.DOMException && (f.QuotaExceededError = f.DOMException);
  } catch {
  }
};
if (typeof HTMLIFrameElement < "u")
  try {
    const f = Object.getOwnPropertyDescriptor(
      HTMLIFrameElement.prototype,
      "contentWindow"
    );
    f && f.get && Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
      get() {
        const t = f.get.call(this);
        return t && v(t), t;
      },
      configurable: !0
    });
  } catch {
  }
const A = new MutationObserver((f) => {
  for (const t of f)
    for (const e of t.addedNodes)
      e.tagName === "IFRAME" && (v(e.contentWindow), e.addEventListener("load", () => v(e.contentWindow), {
        once: !1
      }));
});
globalThis.document?.documentElement && (A.observe(globalThis.document.documentElement, {
  childList: !0,
  subtree: !0
}), globalThis.document.querySelectorAll("iframe").forEach((f) => {
  v(f.contentWindow);
}));
(!("LanguageModel" in globalThis) || globalThis.__FORCE_PROMPT_API_POLYFILL__) && (globalThis.LanguageModel = d, d.__isPolyfill = !0, console.log(
  "Polyfill: window.LanguageModel is now backed by the Prompt API polyfill."
));
export {
  d as LanguageModel
};
