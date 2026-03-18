import { initializeApp as Ue } from "firebase/app";
import { VertexAIBackend as Ve, GoogleAIBackend as We, getAI as Ke, getGenerativeModel as je, InferenceMode as Ge, Schema as m } from "firebase/ai";
import { P as qe, D as Xe } from "../chunks/defaults-CzvdT-At.js";
const Ye = () => {
};
const _e = function(t) {
  const e = [];
  let r = 0;
  for (let n = 0; n < t.length; n++) {
    let s = t.charCodeAt(n);
    s < 128 ? e[r++] = s : s < 2048 ? (e[r++] = s >> 6 | 192, e[r++] = s & 63 | 128) : (s & 64512) === 55296 && n + 1 < t.length && (t.charCodeAt(n + 1) & 64512) === 56320 ? (s = 65536 + ((s & 1023) << 10) + (t.charCodeAt(++n) & 1023), e[r++] = s >> 18 | 240, e[r++] = s >> 12 & 63 | 128, e[r++] = s >> 6 & 63 | 128, e[r++] = s & 63 | 128) : (e[r++] = s >> 12 | 224, e[r++] = s >> 6 & 63 | 128, e[r++] = s & 63 | 128);
  }
  return e;
}, Je = function(t) {
  const e = [];
  let r = 0, n = 0;
  for (; r < t.length; ) {
    const s = t[r++];
    if (s < 128)
      e[n++] = String.fromCharCode(s);
    else if (s > 191 && s < 224) {
      const o = t[r++];
      e[n++] = String.fromCharCode((s & 31) << 6 | o & 63);
    } else if (s > 239 && s < 365) {
      const o = t[r++], i = t[r++], c = t[r++], a = ((s & 7) << 18 | (o & 63) << 12 | (i & 63) << 6 | c & 63) - 65536;
      e[n++] = String.fromCharCode(55296 + (a >> 10)), e[n++] = String.fromCharCode(56320 + (a & 1023));
    } else {
      const o = t[r++], i = t[r++];
      e[n++] = String.fromCharCode((s & 15) << 12 | (o & 63) << 6 | i & 63);
    }
  }
  return e.join("");
}, Y = {
  /**
   * Maps bytes to characters.
   */
  byteToCharMap_: null,
  /**
   * Maps characters to bytes.
   */
  charToByteMap_: null,
  /**
   * Maps bytes to websafe characters.
   * @private
   */
  byteToCharMapWebSafe_: null,
  /**
   * Maps websafe characters to bytes.
   * @private
   */
  charToByteMapWebSafe_: null,
  /**
   * Our default alphabet, shared between
   * ENCODED_VALS and ENCODED_VALS_WEBSAFE
   */
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  /**
   * Our default alphabet. Value 64 (=) is special; it means "nothing."
   */
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  /**
   * Our websafe alphabet.
   */
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  /**
   * Whether this browser supports the atob and btoa functions. This extension
   * started at Mozilla but is now implemented by many browsers. We use the
   * ASSUME_* variables to avoid pulling in the full useragent detection library
   * but still allowing the standard per-browser compilations.
   *
   */
  HAS_NATIVE_SUPPORT: typeof atob == "function",
  /**
   * Base64-encode an array of bytes.
   *
   * @param input An array of bytes (numbers with
   *     value in [0, 255]) to encode.
   * @param webSafe Boolean indicating we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeByteArray(t, e) {
    if (!Array.isArray(t))
      throw Error("encodeByteArray takes an array as a parameter");
    this.init_();
    const r = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_, n = [];
    for (let s = 0; s < t.length; s += 3) {
      const o = t[s], i = s + 1 < t.length, c = i ? t[s + 1] : 0, a = s + 2 < t.length, l = a ? t[s + 2] : 0, p = o >> 2, f = (o & 3) << 4 | c >> 4;
      let S = (c & 15) << 2 | l >> 6, v = l & 63;
      a || (v = 64, i || (S = 64)), n.push(r[p], r[f], r[S], r[v]);
    }
    return n.join("");
  },
  /**
   * Base64-encode a string.
   *
   * @param input A string to encode.
   * @param webSafe If true, we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeString(t, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? btoa(t) : this.encodeByteArray(_e(t), e);
  },
  /**
   * Base64-decode a string.
   *
   * @param input to decode.
   * @param webSafe True if we should use the
   *     alternative alphabet.
   * @return string representing the decoded value.
   */
  decodeString(t, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? atob(t) : Je(this.decodeStringToByteArray(t, e));
  },
  /**
   * Base64-decode a string.
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * @param input Input to decode.
   * @param webSafe True if we should use the web-safe alphabet.
   * @return bytes representing the decoded value.
   */
  decodeStringToByteArray(t, e) {
    this.init_();
    const r = e ? this.charToByteMapWebSafe_ : this.charToByteMap_, n = [];
    for (let s = 0; s < t.length; ) {
      const o = r[t.charAt(s++)], c = s < t.length ? r[t.charAt(s)] : 0;
      ++s;
      const l = s < t.length ? r[t.charAt(s)] : 64;
      ++s;
      const f = s < t.length ? r[t.charAt(s)] : 64;
      if (++s, o == null || c == null || l == null || f == null)
        throw new Ze();
      const S = o << 2 | c >> 4;
      if (n.push(S), l !== 64) {
        const v = c << 4 & 240 | l >> 2;
        if (n.push(v), f !== 64) {
          const ze = l << 6 & 192 | f;
          n.push(ze);
        }
      }
    }
    return n;
  },
  /**
   * Lazy static initialization function. Called before
   * accessing any of the static map variables.
   * @private
   */
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
      for (let t = 0; t < this.ENCODED_VALS.length; t++)
        this.byteToCharMap_[t] = this.ENCODED_VALS.charAt(t), this.charToByteMap_[this.byteToCharMap_[t]] = t, this.byteToCharMapWebSafe_[t] = this.ENCODED_VALS_WEBSAFE.charAt(t), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]] = t, t >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)] = t, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)] = t);
    }
  }
};
class Ze extends Error {
  constructor() {
    super(...arguments), this.name = "DecodeBase64StringError";
  }
}
const Qe = function(t) {
  const e = _e(t);
  return Y.encodeByteArray(e, !0);
}, we = function(t) {
  return Qe(t).replace(/\./g, "");
}, et = function(t) {
  try {
    return Y.decodeString(t, !0);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
function ye() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unable to locate global object.");
}
const tt = () => ye().__FIREBASE_DEFAULTS__, rt = () => {
  if (typeof process > "u" || typeof process.env > "u")
    return;
  const t = process.env.__FIREBASE_DEFAULTS__;
  if (t)
    return JSON.parse(t);
}, nt = () => {
  if (typeof document > "u")
    return;
  let t;
  try {
    t = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch {
    return;
  }
  const e = t && et(t[1]);
  return e && JSON.parse(e);
}, st = () => {
  try {
    return Ye() || tt() || rt() || nt();
  } catch (t) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);
    return;
  }
}, Ae = () => st()?.config;
class I {
  constructor() {
    this.reject = () => {
    }, this.resolve = () => {
    }, this.promise = new Promise((e, r) => {
      this.resolve = e, this.reject = r;
    });
  }
  /**
   * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
   * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
   * and returns a node-style callback which will resolve or reject the Deferred's promise.
   */
  wrapCallback(e) {
    return (r, n) => {
      r ? this.reject(r) : this.resolve(n), typeof e == "function" && (this.promise.catch(() => {
      }), e.length === 1 ? e(r) : e(r, n));
    };
  }
}
function J() {
  try {
    return typeof indexedDB == "object";
  } catch {
    return !1;
  }
}
function ot() {
  return new Promise((t, e) => {
    try {
      let r = !0;
      const n = "validate-browser-context-for-indexeddb-analytics-module", s = self.indexedDB.open(n);
      s.onsuccess = () => {
        s.result.close(), r || self.indexedDB.deleteDatabase(n), t(!0);
      }, s.onupgradeneeded = () => {
        r = !1;
      }, s.onerror = () => {
        e(s.error?.message || "");
      };
    } catch (r) {
      e(r);
    }
  });
}
const it = "FirebaseError";
class k extends Error {
  constructor(e, r, n) {
    super(r), this.code = e, this.customData = n, this.name = it, Object.setPrototypeOf(this, k.prototype), Error.captureStackTrace && Error.captureStackTrace(this, Z.prototype.create);
  }
}
class Z {
  constructor(e, r, n) {
    this.service = e, this.serviceName = r, this.errors = n;
  }
  create(e, ...r) {
    const n = r[0] || {}, s = `${this.service}/${e}`, o = this.errors[e], i = o ? at(o, n) : "Error", c = `${this.serviceName}: ${i} (${s}).`;
    return new k(s, c, n);
  }
}
function at(t, e) {
  return t.replace(ct, (r, n) => {
    const s = e[n];
    return s != null ? String(s) : `<${n}?>`;
  });
}
const ct = /\{\$([^}]+)}/g;
function z(t, e) {
  if (t === e)
    return !0;
  const r = Object.keys(t), n = Object.keys(e);
  for (const s of r) {
    if (!n.includes(s))
      return !1;
    const o = t[s], i = e[s];
    if (oe(o) && oe(i)) {
      if (!z(o, i))
        return !1;
    } else if (o !== i)
      return !1;
  }
  for (const s of n)
    if (!r.includes(s))
      return !1;
  return !0;
}
function oe(t) {
  return t !== null && typeof t == "object";
}
const lt = 1e3, ht = 2, dt = 14400 * 1e3, ut = 0.5;
function ft(t, e = lt, r = ht) {
  const n = e * Math.pow(r, t), s = Math.round(
    // A fraction of the backoff value to add/subtract.
    // Deviation: changes multiplication order to improve readability.
    ut * n * // A random float (rounded to int by Math.round above) in the range [-1, 1]. Determines
    // if we add or subtract.
    (Math.random() - 0.5) * 2
  );
  return Math.min(dt, n + s);
}
function pt(t) {
  return t && t._delegate ? t._delegate : t;
}
class A {
  /**
   *
   * @param name The public service name, e.g. app, auth, firestore, database
   * @param instanceFactory Service factory responsible for creating the public interface
   * @param type whether the service provided by the component is public or private
   */
  constructor(e, r, n) {
    this.name = e, this.instanceFactory = r, this.type = n, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null;
  }
  setInstantiationMode(e) {
    return this.instantiationMode = e, this;
  }
  setMultipleInstances(e) {
    return this.multipleInstances = e, this;
  }
  setServiceProps(e) {
    return this.serviceProps = e, this;
  }
  setInstanceCreatedCallback(e) {
    return this.onInstanceCreated = e, this;
  }
}
const w = "[DEFAULT]";
class gt {
  constructor(e, r) {
    this.name = e, this.container = r, this.component = null, this.instances = /* @__PURE__ */ new Map(), this.instancesDeferred = /* @__PURE__ */ new Map(), this.instancesOptions = /* @__PURE__ */ new Map(), this.onInitCallbacks = /* @__PURE__ */ new Map();
  }
  /**
   * @param identifier A provider can provide multiple instances of a service
   * if this.component.multipleInstances is true.
   */
  get(e) {
    const r = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(r)) {
      const n = new I();
      if (this.instancesDeferred.set(r, n), this.isInitialized(r) || this.shouldAutoInitialize())
        try {
          const s = this.getOrInitializeService({
            instanceIdentifier: r
          });
          s && n.resolve(s);
        } catch {
        }
    }
    return this.instancesDeferred.get(r).promise;
  }
  getImmediate(e) {
    const r = this.normalizeInstanceIdentifier(e?.identifier), n = e?.optional ?? !1;
    if (this.isInitialized(r) || this.shouldAutoInitialize())
      try {
        return this.getOrInitializeService({
          instanceIdentifier: r
        });
      } catch (s) {
        if (n)
          return null;
        throw s;
      }
    else {
      if (n)
        return null;
      throw Error(`Service ${this.name} is not available`);
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(e) {
    if (e.name !== this.name)
      throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
    if (this.component)
      throw Error(`Component for ${this.name} has already been provided`);
    if (this.component = e, !!this.shouldAutoInitialize()) {
      if (bt(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: w });
        } catch {
        }
      for (const [r, n] of this.instancesDeferred.entries()) {
        const s = this.normalizeInstanceIdentifier(r);
        try {
          const o = this.getOrInitializeService({
            instanceIdentifier: s
          });
          n.resolve(o);
        } catch {
        }
      }
    }
  }
  clearInstance(e = w) {
    this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e);
  }
  // app.delete() will call this method on every provider to delete the services
  // TODO: should we mark the provider as deleted?
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([
      ...e.filter((r) => "INTERNAL" in r).map((r) => r.INTERNAL.delete()),
      ...e.filter((r) => "_delete" in r).map((r) => r._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(e = w) {
    return this.instances.has(e);
  }
  getOptions(e = w) {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const { options: r = {} } = e, n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(n))
      throw Error(`${this.name}(${n}) has already been initialized`);
    if (!this.isComponentSet())
      throw Error(`Component ${this.name} has not been registered yet`);
    const s = this.getOrInitializeService({
      instanceIdentifier: n,
      options: r
    });
    for (const [o, i] of this.instancesDeferred.entries()) {
      const c = this.normalizeInstanceIdentifier(o);
      n === c && i.resolve(s);
    }
    return s;
  }
  /**
   *
   * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
   * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
   *
   * @param identifier An optional instance identifier
   * @returns a function to unregister the callback
   */
  onInit(e, r) {
    const n = this.normalizeInstanceIdentifier(r), s = this.onInitCallbacks.get(n) ?? /* @__PURE__ */ new Set();
    s.add(e), this.onInitCallbacks.set(n, s);
    const o = this.instances.get(n);
    return o && e(o, n), () => {
      s.delete(e);
    };
  }
  /**
   * Invoke onInit callbacks synchronously
   * @param instance the service instance`
   */
  invokeOnInitCallbacks(e, r) {
    const n = this.onInitCallbacks.get(r);
    if (n)
      for (const s of n)
        try {
          s(e, r);
        } catch {
        }
  }
  getOrInitializeService({ instanceIdentifier: e, options: r = {} }) {
    let n = this.instances.get(e);
    if (!n && this.component && (n = this.component.instanceFactory(this.container, {
      instanceIdentifier: mt(e),
      options: r
    }), this.instances.set(e, n), this.instancesOptions.set(e, r), this.invokeOnInitCallbacks(n, e), this.component.onInstanceCreated))
      try {
        this.component.onInstanceCreated(this.container, e, n);
      } catch {
      }
    return n || null;
  }
  normalizeInstanceIdentifier(e = w) {
    return this.component ? this.component.multipleInstances ? e : w : e;
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}
function mt(t) {
  return t === w ? void 0 : t;
}
function bt(t) {
  return t.instantiationMode === "EAGER";
}
class Et {
  constructor(e) {
    this.name = e, this.providers = /* @__PURE__ */ new Map();
  }
  /**
   *
   * @param component Component being added
   * @param overwrite When a component with the same name has already been registered,
   * if overwrite is true: overwrite the existing component with the new component and create a new
   * provider with the new component. It can be useful in tests where you want to use different mocks
   * for different tests.
   * if overwrite is false: throw an exception
   */
  addComponent(e) {
    const r = this.getProvider(e.name);
    if (r.isComponentSet())
      throw new Error(`Component ${e.name} has already been registered with ${this.name}`);
    r.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
  }
  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Firebase SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */
  getProvider(e) {
    if (this.providers.has(e))
      return this.providers.get(e);
    const r = new gt(e, this);
    return this.providers.set(e, r), r;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
var h;
(function(t) {
  t[t.DEBUG = 0] = "DEBUG", t[t.VERBOSE = 1] = "VERBOSE", t[t.INFO = 2] = "INFO", t[t.WARN = 3] = "WARN", t[t.ERROR = 4] = "ERROR", t[t.SILENT = 5] = "SILENT";
})(h || (h = {}));
const _t = {
  debug: h.DEBUG,
  verbose: h.VERBOSE,
  info: h.INFO,
  warn: h.WARN,
  error: h.ERROR,
  silent: h.SILENT
}, wt = h.INFO, yt = {
  [h.DEBUG]: "log",
  [h.VERBOSE]: "log",
  [h.INFO]: "info",
  [h.WARN]: "warn",
  [h.ERROR]: "error"
}, At = (t, e, ...r) => {
  if (e < t.logLevel)
    return;
  const n = (/* @__PURE__ */ new Date()).toISOString(), s = yt[e];
  if (s)
    console[s](`[${n}]  ${t.name}:`, ...r);
  else
    throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`);
};
class Ie {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Firebase's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  constructor(e) {
    this.name = e, this._logLevel = wt, this._logHandler = At, this._userLogHandler = null;
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(e) {
    if (!(e in h))
      throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
    this._logLevel = e;
  }
  // Workaround for setter/getter having to be the same type.
  setLogLevel(e) {
    this._logLevel = typeof e == "string" ? _t[e] : e;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(e) {
    if (typeof e != "function")
      throw new TypeError("Value assigned to `logHandler` must be a function");
    this._logHandler = e;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(e) {
    this._userLogHandler = e;
  }
  /**
   * The functions below are all based on the `console` interface
   */
  debug(...e) {
    this._userLogHandler && this._userLogHandler(this, h.DEBUG, ...e), this._logHandler(this, h.DEBUG, ...e);
  }
  log(...e) {
    this._userLogHandler && this._userLogHandler(this, h.VERBOSE, ...e), this._logHandler(this, h.VERBOSE, ...e);
  }
  info(...e) {
    this._userLogHandler && this._userLogHandler(this, h.INFO, ...e), this._logHandler(this, h.INFO, ...e);
  }
  warn(...e) {
    this._userLogHandler && this._userLogHandler(this, h.WARN, ...e), this._logHandler(this, h.WARN, ...e);
  }
  error(...e) {
    this._userLogHandler && this._userLogHandler(this, h.ERROR, ...e), this._logHandler(this, h.ERROR, ...e);
  }
}
const It = (t, e) => e.some((r) => t instanceof r);
let ie, ae;
function Tt() {
  return ie || (ie = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Ct() {
  return ae || (ae = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const Te = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), Ce = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakMap();
function Dt(t) {
  const e = new Promise((r, n) => {
    const s = () => {
      t.removeEventListener("success", o), t.removeEventListener("error", i);
    }, o = () => {
      r(E(t.result)), s();
    }, i = () => {
      n(t.error), s();
    };
    t.addEventListener("success", o), t.addEventListener("error", i);
  });
  return e.then((r) => {
    r instanceof IDBCursor && Te.set(r, t);
  }).catch(() => {
  }), Q.set(e, t), e;
}
function kt(t) {
  if (U.has(t))
    return;
  const e = new Promise((r, n) => {
    const s = () => {
      t.removeEventListener("complete", o), t.removeEventListener("error", i), t.removeEventListener("abort", i);
    }, o = () => {
      r(), s();
    }, i = () => {
      n(t.error || new DOMException("AbortError", "AbortError")), s();
    };
    t.addEventListener("complete", o), t.addEventListener("error", i), t.addEventListener("abort", i);
  });
  U.set(t, e);
}
let V = {
  get(t, e, r) {
    if (t instanceof IDBTransaction) {
      if (e === "done")
        return U.get(t);
      if (e === "objectStoreNames")
        return t.objectStoreNames || Ce.get(t);
      if (e === "store")
        return r.objectStoreNames[1] ? void 0 : r.objectStore(r.objectStoreNames[0]);
    }
    return E(t[e]);
  },
  set(t, e, r) {
    return t[e] = r, !0;
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in t;
  }
};
function St(t) {
  V = t(V);
}
function vt(t) {
  return t === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(e, ...r) {
    const n = t.call($(this), e, ...r);
    return Ce.set(n, e.sort ? e.sort() : [e]), E(n);
  } : Ct().includes(t) ? function(...e) {
    return t.apply($(this), e), E(Te.get(this));
  } : function(...e) {
    return E(t.apply($(this), e));
  };
}
function Rt(t) {
  return typeof t == "function" ? vt(t) : (t instanceof IDBTransaction && kt(t), It(t, Tt()) ? new Proxy(t, V) : t);
}
function E(t) {
  if (t instanceof IDBRequest)
    return Dt(t);
  if (N.has(t))
    return N.get(t);
  const e = Rt(t);
  return e !== t && (N.set(t, e), Q.set(e, t)), e;
}
const $ = (t) => Q.get(t);
function Bt(t, e, { blocked: r, upgrade: n, blocking: s, terminated: o } = {}) {
  const i = indexedDB.open(t, e), c = E(i);
  return n && i.addEventListener("upgradeneeded", (a) => {
    n(E(i.result), a.oldVersion, a.newVersion, E(i.transaction), a);
  }), r && i.addEventListener("blocked", (a) => r(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    a.oldVersion,
    a.newVersion,
    a
  )), c.then((a) => {
    o && a.addEventListener("close", () => o()), s && a.addEventListener("versionchange", (l) => s(l.oldVersion, l.newVersion, l));
  }).catch(() => {
  }), c;
}
const Pt = ["get", "getKey", "getAll", "getAllKeys", "count"], Mt = ["put", "add", "delete", "clear"], x = /* @__PURE__ */ new Map();
function ce(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string"))
    return;
  if (x.get(e))
    return x.get(e);
  const r = e.replace(/FromIndex$/, ""), n = e !== r, s = Mt.includes(r);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(r in (n ? IDBIndex : IDBObjectStore).prototype) || !(s || Pt.includes(r))
  )
    return;
  const o = async function(i, ...c) {
    const a = this.transaction(i, s ? "readwrite" : "readonly");
    let l = a.store;
    return n && (l = l.index(c.shift())), (await Promise.all([
      l[r](...c),
      s && a.done
    ]))[0];
  };
  return x.set(e, o), o;
}
St((t) => ({
  ...t,
  get: (e, r, n) => ce(e, r) || t.get(e, r, n),
  has: (e, r) => !!ce(e, r) || t.has(e, r)
}));
class Ot {
  constructor(e) {
    this.container = e;
  }
  // In initial implementation, this will be called by installations on
  // auth token refresh, and installations will send this string.
  getPlatformInfoString() {
    return this.container.getProviders().map((r) => {
      if (Nt(r)) {
        const n = r.getImmediate();
        return `${n.library}/${n.version}`;
      } else
        return null;
    }).filter((r) => r).join(" ");
  }
}
function Nt(t) {
  return t.getComponent()?.type === "VERSION";
}
const W = "@firebase/app", le = "0.14.9";
const g = new Ie("@firebase/app"), $t = "@firebase/app-compat", xt = "@firebase/analytics-compat", Lt = "@firebase/analytics", Ht = "@firebase/app-check-compat", Ft = "@firebase/app-check", zt = "@firebase/auth", Ut = "@firebase/auth-compat", Vt = "@firebase/database", Wt = "@firebase/data-connect", Kt = "@firebase/database-compat", jt = "@firebase/functions", Gt = "@firebase/functions-compat", qt = "@firebase/installations", Xt = "@firebase/installations-compat", Yt = "@firebase/messaging", Jt = "@firebase/messaging-compat", Zt = "@firebase/performance", Qt = "@firebase/performance-compat", er = "@firebase/remote-config", tr = "@firebase/remote-config-compat", rr = "@firebase/storage", nr = "@firebase/storage-compat", sr = "@firebase/firestore", or = "@firebase/ai", ir = "@firebase/firestore-compat", ar = "firebase";
const K = "[DEFAULT]", cr = {
  [W]: "fire-core",
  [$t]: "fire-core-compat",
  [Lt]: "fire-analytics",
  [xt]: "fire-analytics-compat",
  [Ft]: "fire-app-check",
  [Ht]: "fire-app-check-compat",
  [zt]: "fire-auth",
  [Ut]: "fire-auth-compat",
  [Vt]: "fire-rtdb",
  [Wt]: "fire-data-connect",
  [Kt]: "fire-rtdb-compat",
  [jt]: "fire-fn",
  [Gt]: "fire-fn-compat",
  [qt]: "fire-iid",
  [Xt]: "fire-iid-compat",
  [Yt]: "fire-fcm",
  [Jt]: "fire-fcm-compat",
  [Zt]: "fire-perf",
  [Qt]: "fire-perf-compat",
  [er]: "fire-rc",
  [tr]: "fire-rc-compat",
  [rr]: "fire-gcs",
  [nr]: "fire-gcs-compat",
  [sr]: "fire-fst",
  [ir]: "fire-fst-compat",
  [or]: "fire-vertex",
  "fire-js": "fire-js",
  // Platform identifier for JS SDK.
  [ar]: "fire-js-all"
};
const M = /* @__PURE__ */ new Map(), lr = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
function he(t, e) {
  try {
    t.container.addComponent(e);
  } catch (r) {
    g.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`, r);
  }
}
function T(t) {
  const e = t.name;
  if (j.has(e))
    return g.debug(`There were multiple attempts to register component ${e}.`), !1;
  j.set(e, t);
  for (const r of M.values())
    he(r, t);
  for (const r of lr.values())
    he(r, t);
  return !0;
}
function De(t, e) {
  const r = t.container.getProvider("heartbeat").getImmediate({ optional: !0 });
  return r && r.triggerHeartbeat(), t.container.getProvider(e);
}
const hr = {
  "no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
  "bad-app-name": "Illegal App name: '{$appName}'",
  "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
  "app-deleted": "Firebase App named '{$appName}' already deleted",
  "server-app-deleted": "Firebase Server App has been deleted",
  "no-options": "Need to provide options, when not being deployed to hosting via source.",
  "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  "invalid-log-argument": "First argument to `onLog` must be null or a function.",
  "idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  "finalization-registry-not-supported": "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  "invalid-server-app-environment": "FirebaseServerApp is not for use in browser environments."
}, _ = new Z("app", "Firebase", hr);
class dr {
  constructor(e, r, n) {
    this._isDeleted = !1, this._options = { ...e }, this._config = { ...r }, this._name = r.name, this._automaticDataCollectionEnabled = r.automaticDataCollectionEnabled, this._container = n, this.container.addComponent(new A(
      "app",
      () => this,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
  }
  get automaticDataCollectionEnabled() {
    return this.checkDestroyed(), this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(e) {
    this.checkDestroyed(), this._automaticDataCollectionEnabled = e;
  }
  get name() {
    return this.checkDestroyed(), this._name;
  }
  get options() {
    return this.checkDestroyed(), this._options;
  }
  get config() {
    return this.checkDestroyed(), this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(e) {
    this._isDeleted = e;
  }
  /**
   * This function will throw an Error if the App has already been deleted -
   * use before performing API actions on the App.
   */
  checkDestroyed() {
    if (this.isDeleted)
      throw _.create("app-deleted", { appName: this._name });
  }
}
function ur(t, e = {}) {
  let r = t;
  typeof e != "object" && (e = { name: e });
  const n = {
    name: K,
    automaticDataCollectionEnabled: !0,
    ...e
  }, s = n.name;
  if (typeof s != "string" || !s)
    throw _.create("bad-app-name", {
      appName: String(s)
    });
  if (r || (r = Ae()), !r)
    throw _.create(
      "no-options"
      /* AppError.NO_OPTIONS */
    );
  const o = M.get(s);
  if (o) {
    if (z(r, o.options) && z(n, o.config))
      return o;
    throw _.create("duplicate-app", { appName: s });
  }
  const i = new Et(s);
  for (const a of j.values())
    i.addComponent(a);
  const c = new dr(r, n, i);
  return M.set(s, c), c;
}
function fr(t = K) {
  const e = M.get(t);
  if (!e && t === K && Ae())
    return ur();
  if (!e)
    throw _.create("no-app", { appName: t });
  return e;
}
function P(t, e, r) {
  let n = cr[t] ?? t;
  r && (n += `-${r}`);
  const s = n.match(/\s|\//), o = e.match(/\s|\//);
  if (s || o) {
    const i = [
      `Unable to register library "${n}" with version "${e}":`
    ];
    s && i.push(`library name "${n}" contains illegal characters (whitespace or "/")`), s && o && i.push("and"), o && i.push(`version name "${e}" contains illegal characters (whitespace or "/")`), g.warn(i.join(" "));
    return;
  }
  T(new A(
    `${n}-version`,
    () => ({ library: n, version: e }),
    "VERSION"
    /* ComponentType.VERSION */
  ));
}
const pr = "firebase-heartbeat-database", gr = 1, C = "firebase-heartbeat-store";
let L = null;
function ke() {
  return L || (L = Bt(pr, gr, {
    upgrade: (t, e) => {
      switch (e) {
        case 0:
          try {
            t.createObjectStore(C);
          } catch (r) {
            console.warn(r);
          }
      }
    }
  }).catch((t) => {
    throw _.create("idb-open", {
      originalErrorMessage: t.message
    });
  })), L;
}
async function mr(t) {
  try {
    const r = (await ke()).transaction(C), n = await r.objectStore(C).get(Se(t));
    return await r.done, n;
  } catch (e) {
    if (e instanceof k)
      g.warn(e.message);
    else {
      const r = _.create("idb-get", {
        originalErrorMessage: e?.message
      });
      g.warn(r.message);
    }
  }
}
async function de(t, e) {
  try {
    const n = (await ke()).transaction(C, "readwrite");
    await n.objectStore(C).put(e, Se(t)), await n.done;
  } catch (r) {
    if (r instanceof k)
      g.warn(r.message);
    else {
      const n = _.create("idb-set", {
        originalErrorMessage: r?.message
      });
      g.warn(n.message);
    }
  }
}
function Se(t) {
  return `${t.name}!${t.options.appId}`;
}
const br = 1024, Er = 30;
class _r {
  constructor(e) {
    this.container = e, this._heartbeatsCache = null;
    const r = this.container.getProvider("app").getImmediate();
    this._storage = new yr(r), this._heartbeatsCachePromise = this._storage.read().then((n) => (this._heartbeatsCache = n, n));
  }
  /**
   * Called to report a heartbeat. The function will generate
   * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
   * to IndexedDB.
   * Note that we only store one heartbeat per day. So if a heartbeat for today is
   * already logged, subsequent calls to this function in the same day will be ignored.
   */
  async triggerHeartbeat() {
    try {
      const r = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(), n = ue();
      if (this._heartbeatsCache?.heartbeats == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, this._heartbeatsCache?.heartbeats == null) || this._heartbeatsCache.lastSentHeartbeatDate === n || this._heartbeatsCache.heartbeats.some((s) => s.date === n))
        return;
      if (this._heartbeatsCache.heartbeats.push({ date: n, agent: r }), this._heartbeatsCache.heartbeats.length > Er) {
        const s = Ar(this._heartbeatsCache.heartbeats);
        this._heartbeatsCache.heartbeats.splice(s, 1);
      }
      return this._storage.overwrite(this._heartbeatsCache);
    } catch (e) {
      g.warn(e);
    }
  }
  /**
   * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
   * It also clears all heartbeats from memory as well as in IndexedDB.
   *
   * NOTE: Consuming product SDKs should not send the header if this method
   * returns an empty string.
   */
  async getHeartbeatsHeader() {
    try {
      if (this._heartbeatsCache === null && await this._heartbeatsCachePromise, this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0)
        return "";
      const e = ue(), { heartbeatsToSend: r, unsentEntries: n } = wr(this._heartbeatsCache.heartbeats), s = we(JSON.stringify({ version: 2, heartbeats: r }));
      return this._heartbeatsCache.lastSentHeartbeatDate = e, n.length > 0 ? (this._heartbeatsCache.heartbeats = n, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), s;
    } catch (e) {
      return g.warn(e), "";
    }
  }
}
function ue() {
  return (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}
function wr(t, e = br) {
  const r = [];
  let n = t.slice();
  for (const s of t) {
    const o = r.find((i) => i.agent === s.agent);
    if (o) {
      if (o.dates.push(s.date), fe(r) > e) {
        o.dates.pop();
        break;
      }
    } else if (r.push({
      agent: s.agent,
      dates: [s.date]
    }), fe(r) > e) {
      r.pop();
      break;
    }
    n = n.slice(1);
  }
  return {
    heartbeatsToSend: r,
    unsentEntries: n
  };
}
class yr {
  constructor(e) {
    this.app = e, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    return J() ? ot().then(() => !0).catch(() => !1) : !1;
  }
  /**
   * Read all heartbeats.
   */
  async read() {
    if (await this._canUseIndexedDBPromise) {
      const r = await mr(this.app);
      return r?.heartbeats ? r : { heartbeats: [] };
    } else
      return { heartbeats: [] };
  }
  // overwrite the storage with the provided heartbeats
  async overwrite(e) {
    if (await this._canUseIndexedDBPromise) {
      const n = await this.read();
      return de(this.app, {
        lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? n.lastSentHeartbeatDate,
        heartbeats: e.heartbeats
      });
    } else
      return;
  }
  // add heartbeats
  async add(e) {
    if (await this._canUseIndexedDBPromise) {
      const n = await this.read();
      return de(this.app, {
        lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? n.lastSentHeartbeatDate,
        heartbeats: [
          ...n.heartbeats,
          ...e.heartbeats
        ]
      });
    } else
      return;
  }
}
function fe(t) {
  return we(
    // heartbeatsCache wrapper properties
    JSON.stringify({ version: 2, heartbeats: t })
  ).length;
}
function Ar(t) {
  if (t.length === 0)
    return -1;
  let e = 0, r = t[0].date;
  for (let n = 1; n < t.length; n++)
    t[n].date < r && (r = t[n].date, e = n);
  return e;
}
function Ir(t) {
  T(new A(
    "platform-logger",
    (e) => new Ot(e),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  )), T(new A(
    "heartbeat",
    (e) => new _r(e),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  )), P(W, le, t), P(W, le, "esm2020"), P("fire-js", "");
}
Ir("");
const G = /* @__PURE__ */ new Map(), ve = {
  activated: !1,
  tokenObservers: []
}, Tr = {
  initialized: !1,
  enabled: !1
};
function d(t) {
  return G.get(t) || { ...ve };
}
function Cr(t, e) {
  return G.set(t, e), G.get(t);
}
function O() {
  return Tr;
}
const Re = "https://content-firebaseappcheck.googleapis.com/v1", Dr = "exchangeRecaptchaEnterpriseToken", kr = "exchangeDebugToken", pe = {
  /**
   * This is the first retrial wait after an error. This is currently
   * 30 seconds.
   */
  RETRIAL_MIN_WAIT: 30 * 1e3,
  /**
   * This is the maximum retrial wait, currently 16 minutes.
   */
  RETRIAL_MAX_WAIT: 960 * 1e3
}, Sr = 1440 * 60 * 1e3;
class vr {
  constructor(e, r, n, s, o) {
    if (this.operation = e, this.retryPolicy = r, this.getWaitDuration = n, this.lowerBound = s, this.upperBound = o, this.pending = null, this.nextErrorWaitInterval = s, s > o)
      throw new Error("Proactive refresh lower bound greater than upper bound!");
  }
  start() {
    this.nextErrorWaitInterval = this.lowerBound, this.process(!0).catch(() => {
    });
  }
  stop() {
    this.pending && (this.pending.reject("cancelled"), this.pending = null);
  }
  isRunning() {
    return !!this.pending;
  }
  async process(e) {
    this.stop();
    try {
      this.pending = new I(), this.pending.promise.catch((r) => {
      }), await Rr(this.getNextRun(e)), this.pending.resolve(), await this.pending.promise, this.pending = new I(), this.pending.promise.catch((r) => {
      }), await this.operation(), this.pending.resolve(), await this.pending.promise, this.process(!0).catch(() => {
      });
    } catch (r) {
      this.retryPolicy(r) ? this.process(!1).catch(() => {
      }) : this.stop();
    }
  }
  getNextRun(e) {
    if (e)
      return this.nextErrorWaitInterval = this.lowerBound, this.getWaitDuration();
    {
      const r = this.nextErrorWaitInterval;
      return this.nextErrorWaitInterval *= 2, this.nextErrorWaitInterval > this.upperBound && (this.nextErrorWaitInterval = this.upperBound), r;
    }
  }
}
function Rr(t) {
  return new Promise((e) => {
    setTimeout(e, t);
  });
}
const Br = {
  "already-initialized": "You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.",
  "use-before-activation": "App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.",
  "fetch-network-error": "Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.",
  "fetch-parse-error": "Fetch client could not parse response. Original error: {$originalErrorMessage}.",
  "fetch-status-error": "Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.",
  "storage-open": "Error thrown when opening storage. Original error: {$originalErrorMessage}.",
  "storage-get": "Error thrown when reading from storage. Original error: {$originalErrorMessage}.",
  "storage-set": "Error thrown when writing to storage. Original error: {$originalErrorMessage}.",
  "recaptcha-error": "ReCAPTCHA error.",
  "initial-throttle": "{$httpStatus} error. Attempts allowed again after {$time}",
  throttled: "Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"
}, u = new Z("appCheck", "AppCheck", Br);
function ge(t = !1) {
  return t ? self.grecaptcha?.enterprise : self.grecaptcha;
}
function ee(t) {
  if (!d(t).activated)
    throw u.create("use-before-activation", {
      appName: t.name
    });
}
function Be(t) {
  const e = Math.round(t / 1e3), r = Math.floor(e / (3600 * 24)), n = Math.floor((e - r * 3600 * 24) / 3600), s = Math.floor((e - r * 3600 * 24 - n * 3600) / 60), o = e - r * 3600 * 24 - n * 3600 - s * 60;
  let i = "";
  return r && (i += R(r) + "d:"), n && (i += R(n) + "h:"), i += R(s) + "m:" + R(o) + "s", i;
}
function R(t) {
  return t === 0 ? "00" : t >= 10 ? t.toString() : "0" + t;
}
async function te({ url: t, body: e }, r) {
  const n = {
    "Content-Type": "application/json"
  }, s = r.getImmediate({
    optional: !0
  });
  if (s) {
    const f = await s.getHeartbeatsHeader();
    f && (n["X-Firebase-Client"] = f);
  }
  const o = {
    method: "POST",
    body: JSON.stringify(e),
    headers: n
  };
  let i;
  try {
    i = await fetch(t, o);
  } catch (f) {
    throw u.create("fetch-network-error", {
      originalErrorMessage: f?.message
    });
  }
  if (i.status !== 200)
    throw u.create("fetch-status-error", {
      httpStatus: i.status
    });
  let c;
  try {
    c = await i.json();
  } catch (f) {
    throw u.create("fetch-parse-error", {
      originalErrorMessage: f?.message
    });
  }
  const a = c.ttl.match(/^([\d.]+)(s)$/);
  if (!a || !a[2] || isNaN(Number(a[1])))
    throw u.create("fetch-parse-error", {
      originalErrorMessage: `ttl field (timeToLive) is not in standard Protobuf Duration format: ${c.ttl}`
    });
  const l = Number(a[1]) * 1e3, p = Date.now();
  return {
    token: c.token,
    expireTimeMillis: p + l,
    issuedAtTimeMillis: p
  };
}
function Pr(t, e) {
  const { projectId: r, appId: n, apiKey: s } = t.options;
  return {
    url: `${Re}/projects/${r}/apps/${n}:${Dr}?key=${s}`,
    body: {
      recaptcha_enterprise_token: e
    }
  };
}
function Pe(t, e) {
  const { projectId: r, appId: n, apiKey: s } = t.options;
  return {
    url: `${Re}/projects/${r}/apps/${n}:${kr}?key=${s}`,
    body: {
      // eslint-disable-next-line
      debug_token: e
    }
  };
}
const Mr = "firebase-app-check-database", Or = 1, D = "firebase-app-check-store", Me = "debug-token";
let B = null;
function Oe() {
  return B || (B = new Promise((t, e) => {
    try {
      const r = indexedDB.open(Mr, Or);
      r.onsuccess = (n) => {
        t(n.target.result);
      }, r.onerror = (n) => {
        e(u.create("storage-open", {
          originalErrorMessage: n.target.error?.message
        }));
      }, r.onupgradeneeded = (n) => {
        const s = n.target.result;
        n.oldVersion === 0 && s.createObjectStore(D, {
          keyPath: "compositeKey"
        });
      };
    } catch (r) {
      e(u.create("storage-open", {
        originalErrorMessage: r?.message
      }));
    }
  }), B);
}
function Nr(t) {
  return $e(xe(t));
}
function $r(t, e) {
  return Ne(xe(t), e);
}
function xr(t) {
  return Ne(Me, t);
}
function Lr() {
  return $e(Me);
}
async function Ne(t, e) {
  const n = (await Oe()).transaction(D, "readwrite"), o = n.objectStore(D).put({
    compositeKey: t,
    value: e
  });
  return new Promise((i, c) => {
    o.onsuccess = (a) => {
      i();
    }, n.onerror = (a) => {
      c(u.create("storage-set", {
        originalErrorMessage: a.target.error?.message
      }));
    };
  });
}
async function $e(t) {
  const r = (await Oe()).transaction(D, "readonly"), s = r.objectStore(D).get(t);
  return new Promise((o, i) => {
    s.onsuccess = (c) => {
      const a = c.target.result;
      o(a ? a.value : void 0);
    }, r.onerror = (c) => {
      i(u.create("storage-get", {
        originalErrorMessage: c.target.error?.message
      }));
    };
  });
}
function xe(t) {
  return `${t.options.appId}-${t.name}`;
}
const b = new Ie("@firebase/app-check");
async function Hr(t) {
  if (J()) {
    let e;
    try {
      e = await Nr(t);
    } catch (r) {
      b.warn(`Failed to read token from IndexedDB. Error: ${r}`);
    }
    return e;
  }
}
function H(t, e) {
  return J() ? $r(t, e).catch((r) => {
    b.warn(`Failed to write token to IndexedDB. Error: ${r}`);
  }) : Promise.resolve();
}
async function Fr() {
  let t;
  try {
    t = await Lr();
  } catch {
  }
  if (t)
    return t;
  {
    const e = crypto.randomUUID();
    return xr(e).catch((r) => b.warn(`Failed to persist debug token to IndexedDB. Error: ${r}`)), e;
  }
}
function re() {
  return O().enabled;
}
async function ne() {
  const t = O();
  if (t.enabled && t.token)
    return t.token.promise;
  throw Error(`
            Can't get debug token in production mode.
        `);
}
function zr() {
  const t = ye(), e = O();
  if (e.initialized = !0, typeof t.FIREBASE_APPCHECK_DEBUG_TOKEN != "string" && t.FIREBASE_APPCHECK_DEBUG_TOKEN !== !0)
    return;
  e.enabled = !0;
  const r = new I();
  e.token = r, typeof t.FIREBASE_APPCHECK_DEBUG_TOKEN == "string" ? r.resolve(t.FIREBASE_APPCHECK_DEBUG_TOKEN) : r.resolve(Fr());
}
const Ur = { error: "UNKNOWN_ERROR" };
function Vr(t) {
  return Y.encodeString(
    JSON.stringify(t),
    /* webSafe= */
    !1
  );
}
async function q(t, e = !1, r = !1) {
  const n = t.app;
  ee(n);
  const s = d(n);
  let o = s.token, i;
  if (o && !y(o) && (s.token = void 0, o = void 0), !o) {
    const l = await s.cachedTokenPromise;
    l && (y(l) ? o = l : await H(n, void 0));
  }
  if (!e && o && y(o))
    return {
      token: o.token
    };
  let c = !1;
  if (re())
    try {
      const l = await ne();
      s.exchangeTokenPromise || (s.exchangeTokenPromise = te(Pe(n, l), t.heartbeatServiceProvider).finally(() => {
        s.exchangeTokenPromise = void 0;
      }), c = !0);
      const p = await s.exchangeTokenPromise;
      return await H(n, p), s.token = p, { token: p.token };
    } catch (l) {
      return l.code === "appCheck/throttled" || l.code === "appCheck/initial-throttle" ? b.warn(l.message) : r && b.error(l), F(l);
    }
  try {
    s.exchangeTokenPromise || (s.exchangeTokenPromise = s.provider.getToken().finally(() => {
      s.exchangeTokenPromise = void 0;
    }), c = !0), o = await d(n).exchangeTokenPromise;
  } catch (l) {
    l.code === "appCheck/throttled" || l.code === "appCheck/initial-throttle" ? b.warn(l.message) : r && b.error(l), i = l;
  }
  let a;
  return o ? i ? y(o) ? a = {
    token: o.token,
    internalError: i
  } : a = F(i) : (a = {
    token: o.token
  }, s.token = o, await H(n, o)) : a = F(i), c && Fe(n, a), a;
}
async function Wr(t) {
  const e = t.app;
  ee(e);
  const { provider: r } = d(e);
  if (re()) {
    const n = await ne(), { token: s } = await te(Pe(e, n), t.heartbeatServiceProvider);
    return { token: s };
  } else {
    const { token: n } = await r.getToken();
    return { token: n };
  }
}
function Le(t, e, r, n) {
  const { app: s } = t, o = d(s), i = {
    next: r,
    error: n,
    type: e
  };
  if (o.tokenObservers = [...o.tokenObservers, i], o.token && y(o.token)) {
    const c = o.token;
    Promise.resolve().then(() => {
      r({ token: c.token }), me(t);
    }).catch(() => {
    });
  }
  o.cachedTokenPromise.then(() => me(t));
}
function He(t, e) {
  const r = d(t), n = r.tokenObservers.filter((s) => s.next !== e);
  n.length === 0 && r.tokenRefresher && r.tokenRefresher.isRunning() && r.tokenRefresher.stop(), r.tokenObservers = n;
}
function me(t) {
  const { app: e } = t, r = d(e);
  let n = r.tokenRefresher;
  n || (n = Kr(t), r.tokenRefresher = n), !n.isRunning() && r.isTokenAutoRefreshEnabled && n.start();
}
function Kr(t) {
  const { app: e } = t;
  return new vr(
    // Keep in mind when this fails for any reason other than the ones
    // for which we should retry, it will effectively stop the proactive refresh.
    async () => {
      const r = d(e);
      let n;
      if (r.token ? n = await q(t, !0) : n = await q(t), n.error)
        throw n.error;
      if (n.internalError)
        throw n.internalError;
    },
    () => !0,
    () => {
      const r = d(e);
      if (r.token) {
        let n = r.token.issuedAtTimeMillis + (r.token.expireTimeMillis - r.token.issuedAtTimeMillis) * 0.5 + 3e5;
        const s = r.token.expireTimeMillis - 300 * 1e3;
        return n = Math.min(n, s), Math.max(0, n - Date.now());
      } else
        return 0;
    },
    pe.RETRIAL_MIN_WAIT,
    pe.RETRIAL_MAX_WAIT
  );
}
function Fe(t, e) {
  const r = d(t).tokenObservers;
  for (const n of r)
    try {
      n.type === "EXTERNAL" && e.error != null ? n.error(e.error) : n.next(e);
    } catch {
    }
}
function y(t) {
  return t.expireTimeMillis - Date.now() > 0;
}
function F(t) {
  return {
    token: Vr(Ur),
    error: t
  };
}
class jr {
  constructor(e, r) {
    this.app = e, this.heartbeatServiceProvider = r;
  }
  _delete() {
    const { tokenObservers: e } = d(this.app);
    for (const r of e)
      He(this.app, r.next);
    return Promise.resolve();
  }
}
function Gr(t, e) {
  return new jr(t, e);
}
function qr(t) {
  return {
    getToken: (e) => q(t, e),
    getLimitedUseToken: () => Wr(t),
    addTokenListener: (e) => Le(t, "INTERNAL", e),
    removeTokenListener: (e) => He(t.app, e)
  };
}
const Xr = "@firebase/app-check", Yr = "0.11.1", Jr = "https://www.google.com/recaptcha/enterprise.js";
function Zr(t, e) {
  const r = new I(), n = d(t);
  n.reCAPTCHAState = { initialized: r };
  const s = Qr(t), o = ge(!0);
  return o ? be(t, e, o, s, r) : rn(() => {
    const i = ge(!0);
    if (!i)
      throw new Error("no recaptcha");
    be(t, e, i, s, r);
  }), r.promise;
}
function be(t, e, r, n, s) {
  r.ready(() => {
    tn(t, e, r, n), s.resolve(r);
  });
}
function Qr(t) {
  const e = `fire_app_check_${t.name}`, r = document.createElement("div");
  return r.id = e, r.style.display = "none", document.body.appendChild(r), e;
}
async function en(t) {
  ee(t);
  const r = await d(t).reCAPTCHAState.initialized.promise;
  return new Promise((n, s) => {
    const o = d(t).reCAPTCHAState;
    r.ready(() => {
      n(
        // widgetId is guaranteed to be available if reCAPTCHAState.initialized.promise resolved.
        r.execute(o.widgetId, {
          action: "fire_app_check"
        })
      );
    });
  });
}
function tn(t, e, r, n) {
  const s = r.render(n, {
    sitekey: e,
    size: "invisible",
    // Success callback - set state
    callback: () => {
      d(t).reCAPTCHAState.succeeded = !0;
    },
    // Failure callback - set state
    "error-callback": () => {
      d(t).reCAPTCHAState.succeeded = !1;
    }
  }), o = d(t);
  o.reCAPTCHAState = {
    ...o.reCAPTCHAState,
    // state.reCAPTCHAState is set in the initialize()
    widgetId: s
  };
}
function rn(t) {
  const e = document.createElement("script");
  e.src = Jr, e.onload = t, document.head.appendChild(e);
}
class se {
  /**
   * Create a ReCaptchaEnterpriseProvider instance.
   * @param siteKey - reCAPTCHA Enterprise score-based site key.
   */
  constructor(e) {
    this._siteKey = e, this._throttleData = null;
  }
  /**
   * Returns an App Check token.
   * @internal
   */
  async getToken() {
    sn(this._throttleData);
    const e = await en(this._app).catch((n) => {
      throw u.create(
        "recaptcha-error"
        /* AppCheckError.RECAPTCHA_ERROR */
      );
    });
    if (!d(this._app).reCAPTCHAState?.succeeded)
      throw u.create(
        "recaptcha-error"
        /* AppCheckError.RECAPTCHA_ERROR */
      );
    let r;
    try {
      r = await te(Pr(this._app, e), this._heartbeatServiceProvider);
    } catch (n) {
      throw n.code?.includes(
        "fetch-status-error"
        /* AppCheckError.FETCH_STATUS_ERROR */
      ) ? (this._throttleData = nn(Number(n.customData?.httpStatus), this._throttleData), u.create("initial-throttle", {
        time: Be(this._throttleData.allowRequestsAfter - Date.now()),
        httpStatus: this._throttleData.httpStatus
      })) : n;
    }
    return this._throttleData = null, r;
  }
  /**
   * @internal
   */
  initialize(e) {
    this._app = e, this._heartbeatServiceProvider = De(e, "heartbeat"), Zr(e, this._siteKey).catch(() => {
    });
  }
  /**
   * @internal
   */
  isEqual(e) {
    return e instanceof se ? this._siteKey === e._siteKey : !1;
  }
}
function nn(t, e) {
  if (t === 404 || t === 403)
    return {
      backoffCount: 1,
      allowRequestsAfter: Date.now() + Sr,
      httpStatus: t
    };
  {
    const r = e ? e.backoffCount : 0, n = ft(r, 1e3, 2);
    return {
      backoffCount: r + 1,
      allowRequestsAfter: Date.now() + n,
      httpStatus: t
    };
  }
}
function sn(t) {
  if (t && Date.now() - t.allowRequestsAfter <= 0)
    throw u.create("throttled", {
      time: Be(t.allowRequestsAfter - Date.now()),
      httpStatus: t.httpStatus
    });
}
function on(t = fr(), e) {
  t = pt(t);
  const r = De(t, "app-check");
  if (O().initialized || zr(), re() && ne().then((s) => (
    // Not using logger because I don't think we ever want this accidentally hidden.
    console.log(`App Check debug token: ${s}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`)
  )), r.isInitialized()) {
    const s = r.getImmediate(), o = r.getOptions();
    if (o.isTokenAutoRefreshEnabled === e.isTokenAutoRefreshEnabled && o.provider.isEqual(e.provider))
      return s;
    throw u.create("already-initialized", {
      appName: t.name
    });
  }
  const n = r.initialize({ options: e });
  return an(t, e.provider, e.isTokenAutoRefreshEnabled), d(t).isTokenAutoRefreshEnabled && Le(n, "INTERNAL", () => {
  }), n;
}
function an(t, e, r = !1) {
  const n = Cr(t, { ...ve });
  n.activated = !0, n.provider = e, n.cachedTokenPromise = Hr(t).then((s) => (s && y(s) && (n.token = s, Fe(t, { token: s.token })), s)), n.isTokenAutoRefreshEnabled = r && t.automaticDataCollectionEnabled, !t.automaticDataCollectionEnabled && r && b.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."), n.provider.initialize(t);
}
const cn = "app-check", Ee = "app-check-internal";
function ln() {
  T(new A(
    cn,
    (t) => {
      const e = t.getProvider("app").getImmediate(), r = t.getProvider("heartbeat");
      return Gr(e, r);
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  ).setInstanceCreatedCallback((t, e, r) => {
    t.getProvider(Ee).initialize();
  })), T(new A(
    Ee,
    (t) => {
      const e = t.getProvider("app-check").getImmediate();
      return qr(e);
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  )), P(Xr, Yr);
}
ln();
function X(t) {
  if (!t)
    return;
  const e = {
    description: t.description,
    nullable: t.nullable || !1,
    format: t.format
  };
  switch (Array.isArray(t.type) && t.type.includes("null") && (e.nullable = !0, t.type = t.type.find((r) => r !== "null")), t.type) {
    case "string":
      return t.enum && Array.isArray(t.enum) ? m.enumString({
        ...e,
        enum: t.enum
      }) : m.string(e);
    case "number":
      return m.number(e);
    case "integer":
      return m.integer(e);
    case "boolean":
      return m.boolean(e);
    case "array":
      return m.array({
        ...e,
        // Recursively convert the 'items' schema
        items: X(t.items)
      });
    case "object": {
      const r = {}, n = t.properties ? Object.keys(t.properties) : [];
      n.forEach((i) => {
        r[i] = X(
          t.properties[i]
        );
      });
      const s = t.required || [], o = n.filter(
        (i) => !s.includes(i)
      );
      return m.object({
        ...e,
        properties: r,
        optionalProperties: o
      });
    }
    default:
      return console.warn(
        `Unsupported type: ${t.type}, defaulting to string.`
      ), m.string(e);
  }
}
class fn extends qe {
  #e;
  #t;
  constructor(e) {
    const {
      geminiApiProvider: r,
      modelName: n,
      useAppCheck: s,
      reCaptchaSiteKey: o,
      useLimitedUseAppCheckTokens: i,
      ...c
    } = e;
    super(n || Xe.firebase.modelName);
    const a = Ue(c);
    s && o && on(a, {
      provider: new se(o),
      isTokenAutoRefreshEnabled: !0
    });
    const l = r === "vertex" ? new Ve() : new We();
    this.#t = Ke(a, {
      backend: l,
      useLimitedUseAppCheckTokens: i || !0
    });
  }
  /**
   * Translates a standard JSON Schema into a backend-specific format.
   * @param {Object} schema - The standard JSON Schema.
   * @returns {any} The backend-specific schema.
   */
  convertSchema(e) {
    return X(e);
  }
  /**
   * Creates a model session and stores it.
   * @param {Object} _options - LanguageModel options.
   * @param {Object} sessionParams - Parameters for the cloud or local model.
   * @returns {any} The created session object.
   */
  createSession(e, r) {
    return this.#e = je(this.#t, {
      mode: Ge.ONLY_IN_CLOUD,
      inCloudParams: r
    }), this.#e;
  }
  /**
   * Generates content (non-streaming).
   * @param {Array} contents - The history + new message content.
   * @returns {Promise<{text: string, usage: number}>}
   */
  async generateContent(e) {
    const r = await this.#e.generateContent({ contents: e }), n = r.response.usageMetadata?.promptTokenCount || 0;
    return { text: r.response.text(), usage: n };
  }
  /**
   * Generates content stream.
   * @param {Array} contents - The history + new content.
   * @returns {Promise<AsyncIterable>} Stream of chunks.
   */
  async generateContentStream(e) {
    return (await this.#e.generateContentStream({ contents: e })).stream;
  }
  /**
   * Counts tokens.
   * @param {Array} contents - The content to count.
   * @returns {Promise<number>} Total tokens.
   */
  async countTokens(e) {
    const { totalTokens: r } = await this.#e.countTokens({
      contents: e
    });
    return r;
  }
}
export {
  fn as default
};
