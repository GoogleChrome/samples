import { n as e, t } from "../chunks/defaults-BHsuqSiF.js";
import { initializeApp as n } from "firebase/app";
import { GoogleAIBackend as r, InferenceMode as i, Schema as a, VertexAIBackend as o, getAI as s, getGenerativeModel as c } from "firebase/ai";
//#region node_modules/@firebase/util/dist/postinstall.mjs
var l = () => void 0, u = function(e) {
	let t = [], n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e.charCodeAt(r);
		i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = i & 63 | 128) : (i & 64512) == 55296 && r + 1 < e.length && (e.charCodeAt(r + 1) & 64512) == 56320 ? (i = 65536 + ((i & 1023) << 10) + (e.charCodeAt(++r) & 1023), t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128) : (t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128);
	}
	return t;
}, d = function(e) {
	let t = [], n = 0, r = 0;
	for (; n < e.length;) {
		let i = e[n++];
		if (i < 128) t[r++] = String.fromCharCode(i);
		else if (i > 191 && i < 224) {
			let a = e[n++];
			t[r++] = String.fromCharCode((i & 31) << 6 | a & 63);
		} else if (i > 239 && i < 365) {
			let a = e[n++], o = e[n++], s = e[n++], c = ((i & 7) << 18 | (a & 63) << 12 | (o & 63) << 6 | s & 63) - 65536;
			t[r++] = String.fromCharCode(55296 + (c >> 10)), t[r++] = String.fromCharCode(56320 + (c & 1023));
		} else {
			let a = e[n++], o = e[n++];
			t[r++] = String.fromCharCode((i & 15) << 12 | (a & 63) << 6 | o & 63);
		}
	}
	return t.join("");
}, f = {
	byteToCharMap_: null,
	charToByteMap_: null,
	byteToCharMapWebSafe_: null,
	charToByteMapWebSafe_: null,
	ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
	get ENCODED_VALS() {
		return this.ENCODED_VALS_BASE + "+/=";
	},
	get ENCODED_VALS_WEBSAFE() {
		return this.ENCODED_VALS_BASE + "-_.";
	},
	HAS_NATIVE_SUPPORT: typeof atob == "function",
	encodeByteArray(e, t) {
		if (!Array.isArray(e)) throw Error("encodeByteArray takes an array as a parameter");
		this.init_();
		let n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_, r = [];
		for (let t = 0; t < e.length; t += 3) {
			let i = e[t], a = t + 1 < e.length, o = a ? e[t + 1] : 0, s = t + 2 < e.length, c = s ? e[t + 2] : 0, l = i >> 2, u = (i & 3) << 4 | o >> 4, d = (o & 15) << 2 | c >> 6, f = c & 63;
			s || (f = 64, a || (d = 64)), r.push(n[l], n[u], n[d], n[f]);
		}
		return r.join("");
	},
	encodeString(e, t) {
		return this.HAS_NATIVE_SUPPORT && !t ? btoa(e) : this.encodeByteArray(u(e), t);
	},
	decodeString(e, t) {
		return this.HAS_NATIVE_SUPPORT && !t ? atob(e) : d(this.decodeStringToByteArray(e, t));
	},
	decodeStringToByteArray(e, t) {
		this.init_();
		let n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_, r = [];
		for (let t = 0; t < e.length;) {
			let i = n[e.charAt(t++)], a = t < e.length ? n[e.charAt(t)] : 0;
			++t;
			let o = t < e.length ? n[e.charAt(t)] : 64;
			++t;
			let s = t < e.length ? n[e.charAt(t)] : 64;
			if (++t, i == null || a == null || o == null || s == null) throw new ee();
			let c = i << 2 | a >> 4;
			if (r.push(c), o !== 64) {
				let e = a << 4 & 240 | o >> 2;
				if (r.push(e), s !== 64) {
					let e = o << 6 & 192 | s;
					r.push(e);
				}
			}
		}
		return r;
	},
	init_() {
		if (!this.byteToCharMap_) {
			this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
			for (let e = 0; e < this.ENCODED_VALS.length; e++) this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e), this.charToByteMap_[this.byteToCharMap_[e]] = e, this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e, e >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e);
		}
	}
}, ee = class extends Error {
	constructor() {
		super(...arguments), this.name = "DecodeBase64StringError";
	}
}, te = function(e) {
	let t = u(e);
	return f.encodeByteArray(t, !0);
}, ne = function(e) {
	return te(e).replace(/\./g, "");
}, re = function(e) {
	try {
		return f.decodeString(e, !0);
	} catch (e) {
		console.error("base64Decode failed: ", e);
	}
	return null;
};
function ie() {
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("Unable to locate global object.");
}
var ae = () => ie().__FIREBASE_DEFAULTS__, oe = () => {
	if (typeof process > "u" || process.env === void 0) return;
	let e = process.env.__FIREBASE_DEFAULTS__;
	if (e) return JSON.parse(e);
}, se = () => {
	if (typeof document > "u") return;
	let e;
	try {
		e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
	} catch {
		return;
	}
	let t = e && re(e[1]);
	return t && JSON.parse(t);
}, ce = () => {
	try {
		return l() || ae() || oe() || se();
	} catch (e) {
		console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
		return;
	}
}, le = () => ce()?.config, p = class {
	constructor() {
		this.reject = () => {}, this.resolve = () => {}, this.promise = new Promise((e, t) => {
			this.resolve = e, this.reject = t;
		});
	}
	wrapCallback(e) {
		return (t, n) => {
			t ? this.reject(t) : this.resolve(n), typeof e == "function" && (this.promise.catch(() => {}), e.length === 1 ? e(t) : e(t, n));
		};
	}
};
function m() {
	try {
		return typeof indexedDB == "object";
	} catch {
		return !1;
	}
}
function ue() {
	return new Promise((e, t) => {
		try {
			let n = !0, r = "validate-browser-context-for-indexeddb-analytics-module", i = self.indexedDB.open(r);
			i.onsuccess = () => {
				i.result.close(), n || self.indexedDB.deleteDatabase(r), e(!0);
			}, i.onupgradeneeded = () => {
				n = !1;
			}, i.onerror = () => {
				t(i.error?.message || "");
			};
		} catch (e) {
			t(e);
		}
	});
}
var de = "FirebaseError", h = class e extends Error {
	constructor(t, n, r) {
		super(n), this.code = t, this.customData = r, this.name = de, Object.setPrototypeOf(this, e.prototype), Error.captureStackTrace && Error.captureStackTrace(this, g.prototype.create);
	}
}, g = class {
	constructor(e, t, n) {
		this.service = e, this.serviceName = t, this.errors = n;
	}
	create(e, ...t) {
		let n = t[0] || {}, r = `${this.service}/${e}`, i = this.errors[e], a = i ? fe(i, n) : "Error";
		return new h(r, `${this.serviceName}: ${a} (${r}).`, n);
	}
};
function fe(e, t) {
	return e.replace(pe, (e, n) => {
		let r = t[n];
		return r == null ? `<${n}?>` : String(r);
	});
}
var pe = /\{\$([^}]+)}/g;
function _(e, t) {
	if (e === t) return !0;
	let n = Object.keys(e), r = Object.keys(t);
	for (let i of n) {
		if (!r.includes(i)) return !1;
		let n = e[i], a = t[i];
		if (me(n) && me(a)) {
			if (!_(n, a)) return !1;
		} else if (n !== a) return !1;
	}
	for (let e of r) if (!n.includes(e)) return !1;
	return !0;
}
function me(e) {
	return typeof e == "object" && !!e;
}
var he = 1e3, ge = 2, _e = 14400 * 1e3, ve = .5;
function ye(e, t = he, n = ge) {
	let r = t * n ** +e, i = Math.round(ve * r * (Math.random() - .5) * 2);
	return Math.min(_e, r + i);
}
function be(e) {
	return e && e._delegate ? e._delegate : e;
}
//#endregion
//#region node_modules/@firebase/component/dist/esm/index.esm.js
var v = class {
	constructor(e, t, n) {
		this.name = e, this.instanceFactory = t, this.type = n, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null;
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
}, y = "[DEFAULT]", xe = class {
	constructor(e, t) {
		this.name = e, this.container = t, this.component = null, this.instances = /* @__PURE__ */ new Map(), this.instancesDeferred = /* @__PURE__ */ new Map(), this.instancesOptions = /* @__PURE__ */ new Map(), this.onInitCallbacks = /* @__PURE__ */ new Map();
	}
	get(e) {
		let t = this.normalizeInstanceIdentifier(e);
		if (!this.instancesDeferred.has(t)) {
			let e = new p();
			if (this.instancesDeferred.set(t, e), this.isInitialized(t) || this.shouldAutoInitialize()) try {
				let n = this.getOrInitializeService({ instanceIdentifier: t });
				n && e.resolve(n);
			} catch {}
		}
		return this.instancesDeferred.get(t).promise;
	}
	getImmediate(e) {
		let t = this.normalizeInstanceIdentifier(e?.identifier), n = e?.optional ?? !1;
		if (this.isInitialized(t) || this.shouldAutoInitialize()) try {
			return this.getOrInitializeService({ instanceIdentifier: t });
		} catch (e) {
			if (n) return null;
			throw e;
		}
		else if (n) return null;
		else throw Error(`Service ${this.name} is not available`);
	}
	getComponent() {
		return this.component;
	}
	setComponent(e) {
		if (e.name !== this.name) throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
		if (this.component) throw Error(`Component for ${this.name} has already been provided`);
		if (this.component = e, this.shouldAutoInitialize()) {
			if (Ce(e)) try {
				this.getOrInitializeService({ instanceIdentifier: y });
			} catch {}
			for (let [e, t] of this.instancesDeferred.entries()) {
				let n = this.normalizeInstanceIdentifier(e);
				try {
					let e = this.getOrInitializeService({ instanceIdentifier: n });
					t.resolve(e);
				} catch {}
			}
		}
	}
	clearInstance(e = y) {
		this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e);
	}
	async delete() {
		let e = Array.from(this.instances.values());
		await Promise.all([...e.filter((e) => "INTERNAL" in e).map((e) => e.INTERNAL.delete()), ...e.filter((e) => "_delete" in e).map((e) => e._delete())]);
	}
	isComponentSet() {
		return this.component != null;
	}
	isInitialized(e = y) {
		return this.instances.has(e);
	}
	getOptions(e = y) {
		return this.instancesOptions.get(e) || {};
	}
	initialize(e = {}) {
		let { options: t = {} } = e, n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
		if (this.isInitialized(n)) throw Error(`${this.name}(${n}) has already been initialized`);
		if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
		let r = this.getOrInitializeService({
			instanceIdentifier: n,
			options: t
		});
		for (let [e, t] of this.instancesDeferred.entries()) n === this.normalizeInstanceIdentifier(e) && t.resolve(r);
		return r;
	}
	onInit(e, t) {
		let n = this.normalizeInstanceIdentifier(t), r = this.onInitCallbacks.get(n) ?? /* @__PURE__ */ new Set();
		r.add(e), this.onInitCallbacks.set(n, r);
		let i = this.instances.get(n);
		return i && e(i, n), () => {
			r.delete(e);
		};
	}
	invokeOnInitCallbacks(e, t) {
		let n = this.onInitCallbacks.get(t);
		if (n) for (let r of n) try {
			r(e, t);
		} catch {}
	}
	getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
		let n = this.instances.get(e);
		if (!n && this.component && (n = this.component.instanceFactory(this.container, {
			instanceIdentifier: Se(e),
			options: t
		}), this.instances.set(e, n), this.instancesOptions.set(e, t), this.invokeOnInitCallbacks(n, e), this.component.onInstanceCreated)) try {
			this.component.onInstanceCreated(this.container, e, n);
		} catch {}
		return n || null;
	}
	normalizeInstanceIdentifier(e = y) {
		return this.component ? this.component.multipleInstances ? e : y : e;
	}
	shouldAutoInitialize() {
		return !!this.component && this.component.instantiationMode !== "EXPLICIT";
	}
};
function Se(e) {
	return e === y ? void 0 : e;
}
function Ce(e) {
	return e.instantiationMode === "EAGER";
}
var we = class {
	constructor(e) {
		this.name = e, this.providers = /* @__PURE__ */ new Map();
	}
	addComponent(e) {
		let t = this.getProvider(e.name);
		if (t.isComponentSet()) throw Error(`Component ${e.name} has already been registered with ${this.name}`);
		t.setComponent(e);
	}
	addOrOverwriteComponent(e) {
		this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
	}
	getProvider(e) {
		if (this.providers.has(e)) return this.providers.get(e);
		let t = new xe(e, this);
		return this.providers.set(e, t), t;
	}
	getProviders() {
		return Array.from(this.providers.values());
	}
}, Te = [], b;
(function(e) {
	e[e.DEBUG = 0] = "DEBUG", e[e.VERBOSE = 1] = "VERBOSE", e[e.INFO = 2] = "INFO", e[e.WARN = 3] = "WARN", e[e.ERROR = 4] = "ERROR", e[e.SILENT = 5] = "SILENT";
})(b ||= {});
var Ee = {
	debug: b.DEBUG,
	verbose: b.VERBOSE,
	info: b.INFO,
	warn: b.WARN,
	error: b.ERROR,
	silent: b.SILENT
}, De = b.INFO, Oe = {
	[b.DEBUG]: "log",
	[b.VERBOSE]: "log",
	[b.INFO]: "info",
	[b.WARN]: "warn",
	[b.ERROR]: "error"
}, ke = (e, t, ...n) => {
	if (t < e.logLevel) return;
	let r = (/* @__PURE__ */ new Date()).toISOString(), i = Oe[t];
	if (i) console[i](`[${r}]  ${e.name}:`, ...n);
	else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`);
}, Ae = class {
	constructor(e) {
		this.name = e, this._logLevel = De, this._logHandler = ke, this._userLogHandler = null, Te.push(this);
	}
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(e) {
		if (!(e in b)) throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
		this._logLevel = e;
	}
	setLogLevel(e) {
		this._logLevel = typeof e == "string" ? Ee[e] : e;
	}
	get logHandler() {
		return this._logHandler;
	}
	set logHandler(e) {
		if (typeof e != "function") throw TypeError("Value assigned to `logHandler` must be a function");
		this._logHandler = e;
	}
	get userLogHandler() {
		return this._userLogHandler;
	}
	set userLogHandler(e) {
		this._userLogHandler = e;
	}
	debug(...e) {
		this._userLogHandler && this._userLogHandler(this, b.DEBUG, ...e), this._logHandler(this, b.DEBUG, ...e);
	}
	log(...e) {
		this._userLogHandler && this._userLogHandler(this, b.VERBOSE, ...e), this._logHandler(this, b.VERBOSE, ...e);
	}
	info(...e) {
		this._userLogHandler && this._userLogHandler(this, b.INFO, ...e), this._logHandler(this, b.INFO, ...e);
	}
	warn(...e) {
		this._userLogHandler && this._userLogHandler(this, b.WARN, ...e), this._logHandler(this, b.WARN, ...e);
	}
	error(...e) {
		this._userLogHandler && this._userLogHandler(this, b.ERROR, ...e), this._logHandler(this, b.ERROR, ...e);
	}
}, je = (e, t) => t.some((t) => e instanceof t), Me, Ne;
function Pe() {
	return Me ||= [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	];
}
function Fe() {
	return Ne ||= [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	];
}
var Ie = /* @__PURE__ */ new WeakMap(), x = /* @__PURE__ */ new WeakMap(), Le = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap();
function Re(e) {
	let t = new Promise((t, n) => {
		let r = () => {
			e.removeEventListener("success", i), e.removeEventListener("error", a);
		}, i = () => {
			t(T(e.result)), r();
		}, a = () => {
			n(e.error), r();
		};
		e.addEventListener("success", i), e.addEventListener("error", a);
	});
	return t.then((t) => {
		t instanceof IDBCursor && Ie.set(t, e);
	}).catch(() => {}), C.set(t, e), t;
}
function ze(e) {
	if (x.has(e)) return;
	let t = new Promise((t, n) => {
		let r = () => {
			e.removeEventListener("complete", i), e.removeEventListener("error", a), e.removeEventListener("abort", a);
		}, i = () => {
			t(), r();
		}, a = () => {
			n(e.error || new DOMException("AbortError", "AbortError")), r();
		};
		e.addEventListener("complete", i), e.addEventListener("error", a), e.addEventListener("abort", a);
	});
	x.set(e, t);
}
var w = {
	get(e, t, n) {
		if (e instanceof IDBTransaction) {
			if (t === "done") return x.get(e);
			if (t === "objectStoreNames") return e.objectStoreNames || Le.get(e);
			if (t === "store") return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
		}
		return T(e[t]);
	},
	set(e, t, n) {
		return e[t] = n, !0;
	},
	has(e, t) {
		return e instanceof IDBTransaction && (t === "done" || t === "store") ? !0 : t in e;
	}
};
function Be(e) {
	w = e(w);
}
function Ve(e) {
	return e === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(t, ...n) {
		let r = e.call(E(this), t, ...n);
		return Le.set(r, t.sort ? t.sort() : [t]), T(r);
	} : Fe().includes(e) ? function(...t) {
		return e.apply(E(this), t), T(Ie.get(this));
	} : function(...t) {
		return T(e.apply(E(this), t));
	};
}
function He(e) {
	return typeof e == "function" ? Ve(e) : (e instanceof IDBTransaction && ze(e), je(e, Pe()) ? new Proxy(e, w) : e);
}
function T(e) {
	if (e instanceof IDBRequest) return Re(e);
	if (S.has(e)) return S.get(e);
	let t = He(e);
	return t !== e && (S.set(e, t), C.set(t, e)), t;
}
var E = (e) => C.get(e);
//#endregion
//#region node_modules/idb/build/index.js
function Ue(e, t, { blocked: n, upgrade: r, blocking: i, terminated: a } = {}) {
	let o = indexedDB.open(e, t), s = T(o);
	return r && o.addEventListener("upgradeneeded", (e) => {
		r(T(o.result), e.oldVersion, e.newVersion, T(o.transaction), e);
	}), n && o.addEventListener("blocked", (e) => n(e.oldVersion, e.newVersion, e)), s.then((e) => {
		a && e.addEventListener("close", () => a()), i && e.addEventListener("versionchange", (e) => i(e.oldVersion, e.newVersion, e));
	}).catch(() => {}), s;
}
var We = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
], Ge = [
	"put",
	"add",
	"delete",
	"clear"
], D = /* @__PURE__ */ new Map();
function Ke(e, t) {
	if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string")) return;
	if (D.get(t)) return D.get(t);
	let n = t.replace(/FromIndex$/, ""), r = t !== n, i = Ge.includes(n);
	if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || We.includes(n))) return;
	let a = async function(e, ...t) {
		let a = this.transaction(e, i ? "readwrite" : "readonly"), o = a.store;
		return r && (o = o.index(t.shift())), (await Promise.all([o[n](...t), i && a.done]))[0];
	};
	return D.set(t, a), a;
}
Be((e) => ({
	...e,
	get: (t, n, r) => Ke(t, n) || e.get(t, n, r),
	has: (t, n) => !!Ke(t, n) || e.has(t, n)
}));
//#endregion
//#region node_modules/@firebase/app/dist/esm/index.esm.js
var qe = class {
	constructor(e) {
		this.container = e;
	}
	getPlatformInfoString() {
		return this.container.getProviders().map((e) => {
			if (Je(e)) {
				let t = e.getImmediate();
				return `${t.library}/${t.version}`;
			} else return null;
		}).filter((e) => e).join(" ");
	}
};
function Je(e) {
	return e.getComponent()?.type === "VERSION";
}
var O = "@firebase/app", Ye = "0.14.10", k = new Ae("@firebase/app"), Xe = "@firebase/app-compat", Ze = "@firebase/analytics-compat", Qe = "@firebase/analytics", $e = "@firebase/app-check-compat", et = "@firebase/app-check", tt = "@firebase/auth", nt = "@firebase/auth-compat", rt = "@firebase/database", it = "@firebase/data-connect", at = "@firebase/database-compat", ot = "@firebase/functions", st = "@firebase/functions-compat", ct = "@firebase/installations", lt = "@firebase/installations-compat", ut = "@firebase/messaging", dt = "@firebase/messaging-compat", ft = "@firebase/performance", pt = "@firebase/performance-compat", mt = "@firebase/remote-config", ht = "@firebase/remote-config-compat", gt = "@firebase/storage", _t = "@firebase/storage-compat", vt = "@firebase/firestore", yt = "@firebase/ai", bt = "@firebase/firestore-compat", xt = "firebase", St = "[DEFAULT]", Ct = {
	[O]: "fire-core",
	[Xe]: "fire-core-compat",
	[Qe]: "fire-analytics",
	[Ze]: "fire-analytics-compat",
	[et]: "fire-app-check",
	[$e]: "fire-app-check-compat",
	[tt]: "fire-auth",
	[nt]: "fire-auth-compat",
	[rt]: "fire-rtdb",
	[it]: "fire-data-connect",
	[at]: "fire-rtdb-compat",
	[ot]: "fire-fn",
	[st]: "fire-fn-compat",
	[ct]: "fire-iid",
	[lt]: "fire-iid-compat",
	[ut]: "fire-fcm",
	[dt]: "fire-fcm-compat",
	[ft]: "fire-perf",
	[pt]: "fire-perf-compat",
	[mt]: "fire-rc",
	[ht]: "fire-rc-compat",
	[gt]: "fire-gcs",
	[_t]: "fire-gcs-compat",
	[vt]: "fire-fst",
	[bt]: "fire-fst-compat",
	[yt]: "fire-vertex",
	"fire-js": "fire-js",
	[xt]: "fire-js-all"
}, A = /* @__PURE__ */ new Map(), wt = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
function Tt(e, t) {
	try {
		e.container.addComponent(t);
	} catch (n) {
		k.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`, n);
	}
}
function M(e) {
	let t = e.name;
	if (j.has(t)) return k.debug(`There were multiple attempts to register component ${t}.`), !1;
	j.set(t, e);
	for (let t of A.values()) Tt(t, e);
	for (let t of wt.values()) Tt(t, e);
	return !0;
}
function Et(e, t) {
	let n = e.container.getProvider("heartbeat").getImmediate({ optional: !0 });
	return n && n.triggerHeartbeat(), e.container.getProvider(t);
}
var N = new g("app", "Firebase", {
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
}), Dt = class {
	constructor(e, t, n) {
		this._isDeleted = !1, this._options = { ...e }, this._config = { ...t }, this._name = t.name, this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled, this._container = n, this.container.addComponent(new v("app", () => this, "PUBLIC"));
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
	checkDestroyed() {
		if (this.isDeleted) throw N.create("app-deleted", { appName: this._name });
	}
};
function Ot(e, t = {}) {
	let n = e;
	typeof t != "object" && (t = { name: t });
	let r = {
		name: St,
		automaticDataCollectionEnabled: !0,
		...t
	}, i = r.name;
	if (typeof i != "string" || !i) throw N.create("bad-app-name", { appName: String(i) });
	if (n ||= le(), !n) throw N.create("no-options");
	let a = A.get(i);
	if (a) {
		if (_(n, a.options) && _(r, a.config)) return a;
		throw N.create("duplicate-app", { appName: i });
	}
	let o = new we(i);
	for (let e of j.values()) o.addComponent(e);
	let s = new Dt(n, r, o);
	return A.set(i, s), s;
}
function kt(e = St) {
	let t = A.get(e);
	if (!t && e === "[DEFAULT]" && le()) return Ot();
	if (!t) throw N.create("no-app", { appName: e });
	return t;
}
function P(e, t, n) {
	let r = Ct[e] ?? e;
	n && (r += `-${n}`);
	let i = r.match(/\s|\//), a = t.match(/\s|\//);
	if (i || a) {
		let e = [`Unable to register library "${r}" with version "${t}":`];
		i && e.push(`library name "${r}" contains illegal characters (whitespace or "/")`), i && a && e.push("and"), a && e.push(`version name "${t}" contains illegal characters (whitespace or "/")`), k.warn(e.join(" "));
		return;
	}
	M(new v(`${r}-version`, () => ({
		library: r,
		version: t
	}), "VERSION"));
}
var At = "firebase-heartbeat-database", jt = 1, F = "firebase-heartbeat-store", Mt = null;
function Nt() {
	return Mt ||= Ue(At, jt, { upgrade: (e, t) => {
		switch (t) {
			case 0: try {
				e.createObjectStore(F);
			} catch (e) {
				console.warn(e);
			}
		}
	} }).catch((e) => {
		throw N.create("idb-open", { originalErrorMessage: e.message });
	}), Mt;
}
async function Pt(e) {
	try {
		let t = (await Nt()).transaction(F), n = await t.objectStore(F).get(It(e));
		return await t.done, n;
	} catch (e) {
		if (e instanceof h) k.warn(e.message);
		else {
			let t = N.create("idb-get", { originalErrorMessage: e?.message });
			k.warn(t.message);
		}
	}
}
async function Ft(e, t) {
	try {
		let n = (await Nt()).transaction(F, "readwrite");
		await n.objectStore(F).put(t, It(e)), await n.done;
	} catch (e) {
		if (e instanceof h) k.warn(e.message);
		else {
			let t = N.create("idb-set", { originalErrorMessage: e?.message });
			k.warn(t.message);
		}
	}
}
function It(e) {
	return `${e.name}!${e.options.appId}`;
}
var Lt = 1024, Rt = 30, zt = class {
	constructor(e) {
		this.container = e, this._heartbeatsCache = null, this._storage = new Ht(this.container.getProvider("app").getImmediate()), this._heartbeatsCachePromise = this._storage.read().then((e) => (this._heartbeatsCache = e, e));
	}
	async triggerHeartbeat() {
		try {
			let e = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(), t = Bt();
			if (this._heartbeatsCache?.heartbeats == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, this._heartbeatsCache?.heartbeats == null) || this._heartbeatsCache.lastSentHeartbeatDate === t || this._heartbeatsCache.heartbeats.some((e) => e.date === t)) return;
			if (this._heartbeatsCache.heartbeats.push({
				date: t,
				agent: e
			}), this._heartbeatsCache.heartbeats.length > Rt) {
				let e = Wt(this._heartbeatsCache.heartbeats);
				this._heartbeatsCache.heartbeats.splice(e, 1);
			}
			return this._storage.overwrite(this._heartbeatsCache);
		} catch (e) {
			k.warn(e);
		}
	}
	async getHeartbeatsHeader() {
		try {
			if (this._heartbeatsCache === null && await this._heartbeatsCachePromise, this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) return "";
			let e = Bt(), { heartbeatsToSend: t, unsentEntries: n } = Vt(this._heartbeatsCache.heartbeats), r = ne(JSON.stringify({
				version: 2,
				heartbeats: t
			}));
			return this._heartbeatsCache.lastSentHeartbeatDate = e, n.length > 0 ? (this._heartbeatsCache.heartbeats = n, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), r;
		} catch (e) {
			return k.warn(e), "";
		}
	}
};
function Bt() {
	return (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}
function Vt(e, t = Lt) {
	let n = [], r = e.slice();
	for (let i of e) {
		let e = n.find((e) => e.agent === i.agent);
		if (!e) {
			if (n.push({
				agent: i.agent,
				dates: [i.date]
			}), Ut(n) > t) {
				n.pop();
				break;
			}
		} else if (e.dates.push(i.date), Ut(n) > t) {
			e.dates.pop();
			break;
		}
		r = r.slice(1);
	}
	return {
		heartbeatsToSend: n,
		unsentEntries: r
	};
}
var Ht = class {
	constructor(e) {
		this.app = e, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
	}
	async runIndexedDBEnvironmentCheck() {
		return m() ? ue().then(() => !0).catch(() => !1) : !1;
	}
	async read() {
		if (await this._canUseIndexedDBPromise) {
			let e = await Pt(this.app);
			return e?.heartbeats ? e : { heartbeats: [] };
		} else return { heartbeats: [] };
	}
	async overwrite(e) {
		if (await this._canUseIndexedDBPromise) {
			let t = await this.read();
			return Ft(this.app, {
				lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? t.lastSentHeartbeatDate,
				heartbeats: e.heartbeats
			});
		} else return;
	}
	async add(e) {
		if (await this._canUseIndexedDBPromise) {
			let t = await this.read();
			return Ft(this.app, {
				lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? t.lastSentHeartbeatDate,
				heartbeats: [...t.heartbeats, ...e.heartbeats]
			});
		} else return;
	}
};
function Ut(e) {
	return ne(JSON.stringify({
		version: 2,
		heartbeats: e
	})).length;
}
function Wt(e) {
	if (e.length === 0) return -1;
	let t = 0, n = e[0].date;
	for (let r = 1; r < e.length; r++) e[r].date < n && (n = e[r].date, t = r);
	return t;
}
function Gt(e) {
	M(new v("platform-logger", (e) => new qe(e), "PRIVATE")), M(new v("heartbeat", (e) => new zt(e), "PRIVATE")), P(O, Ye, e), P(O, Ye, "esm2020"), P("fire-js", "");
}
Gt("");
//#endregion
//#region node_modules/@firebase/app-check/dist/esm/index.esm.js
var I = /* @__PURE__ */ new Map(), Kt = {
	activated: !1,
	tokenObservers: []
}, qt = {
	initialized: !1,
	enabled: !1
};
function L(e) {
	return I.get(e) || { ...Kt };
}
function Jt(e, t) {
	return I.set(e, t), I.get(e);
}
function R() {
	return qt;
}
var Yt = "https://content-firebaseappcheck.googleapis.com/v1", Xt = "exchangeRecaptchaEnterpriseToken", Zt = "exchangeDebugToken", Qt = {
	OFFSET_DURATION: 300 * 1e3,
	RETRIAL_MIN_WAIT: 30 * 1e3,
	RETRIAL_MAX_WAIT: 960 * 1e3
}, $t = 1440 * 60 * 1e3, en = class {
	constructor(e, t, n, r, i) {
		if (this.operation = e, this.retryPolicy = t, this.getWaitDuration = n, this.lowerBound = r, this.upperBound = i, this.pending = null, this.nextErrorWaitInterval = r, r > i) throw Error("Proactive refresh lower bound greater than upper bound!");
	}
	start() {
		this.nextErrorWaitInterval = this.lowerBound, this.process(!0).catch(() => {});
	}
	stop() {
		this.pending &&= (this.pending.reject("cancelled"), null);
	}
	isRunning() {
		return !!this.pending;
	}
	async process(e) {
		this.stop();
		try {
			this.pending = new p(), this.pending.promise.catch((e) => {}), await tn(this.getNextRun(e)), this.pending.resolve(), await this.pending.promise, this.pending = new p(), this.pending.promise.catch((e) => {}), await this.operation(), this.pending.resolve(), await this.pending.promise, this.process(!0).catch(() => {});
		} catch (e) {
			this.retryPolicy(e) ? this.process(!1).catch(() => {}) : this.stop();
		}
	}
	getNextRun(e) {
		if (e) return this.nextErrorWaitInterval = this.lowerBound, this.getWaitDuration();
		{
			let e = this.nextErrorWaitInterval;
			return this.nextErrorWaitInterval *= 2, this.nextErrorWaitInterval > this.upperBound && (this.nextErrorWaitInterval = this.upperBound), e;
		}
	}
};
function tn(e) {
	return new Promise((t) => {
		setTimeout(t, e);
	});
}
var z = new g("appCheck", "AppCheck", {
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
});
function nn(e = !1) {
	return e ? self.grecaptcha?.enterprise : self.grecaptcha;
}
function B(e) {
	if (!L(e).activated) throw z.create("use-before-activation", { appName: e.name });
}
function rn(e) {
	let t = Math.round(e / 1e3), n = Math.floor(t / (3600 * 24)), r = Math.floor((t - n * 3600 * 24) / 3600), i = Math.floor((t - n * 3600 * 24 - r * 3600) / 60), a = t - n * 3600 * 24 - r * 3600 - i * 60, o = "";
	return n && (o += V(n) + "d:"), r && (o += V(r) + "h:"), o += V(i) + "m:" + V(a) + "s", o;
}
function V(e) {
	return e === 0 ? "00" : e >= 10 ? e.toString() : "0" + e;
}
async function H({ url: e, body: t }, n) {
	let r = { "Content-Type": "application/json" }, i = n.getImmediate({ optional: !0 });
	if (i) {
		let e = await i.getHeartbeatsHeader();
		e && (r["X-Firebase-Client"] = e);
	}
	let a = {
		method: "POST",
		body: JSON.stringify(t),
		headers: r
	}, o;
	try {
		o = await fetch(e, a);
	} catch (e) {
		throw z.create("fetch-network-error", { originalErrorMessage: e?.message });
	}
	if (o.status !== 200) throw z.create("fetch-status-error", { httpStatus: o.status });
	let s;
	try {
		s = await o.json();
	} catch (e) {
		throw z.create("fetch-parse-error", { originalErrorMessage: e?.message });
	}
	let c = s.ttl.match(/^([\d.]+)(s)$/);
	if (!c || !c[2] || isNaN(Number(c[1]))) throw z.create("fetch-parse-error", { originalErrorMessage: `ttl field (timeToLive) is not in standard Protobuf Duration format: ${s.ttl}` });
	let l = Number(c[1]) * 1e3, u = Date.now();
	return {
		token: s.token,
		expireTimeMillis: u + l,
		issuedAtTimeMillis: u
	};
}
function an(e, t) {
	let { projectId: n, appId: r, apiKey: i } = e.options;
	return {
		url: `${Yt}/projects/${n}/apps/${r}:${Xt}?key=${i}`,
		body: { recaptcha_enterprise_token: t }
	};
}
function on(e, t) {
	let { projectId: n, appId: r, apiKey: i } = e.options;
	return {
		url: `${Yt}/projects/${n}/apps/${r}:${Zt}?key=${i}`,
		body: { debug_token: t }
	};
}
var sn = "firebase-app-check-database", cn = 1, U = "firebase-app-check-store", ln = "debug-token", W = null;
function un() {
	return W || (W = new Promise((e, t) => {
		try {
			let n = indexedDB.open(sn, cn);
			n.onsuccess = (t) => {
				e(t.target.result);
			}, n.onerror = (e) => {
				t(z.create("storage-open", { originalErrorMessage: e.target.error?.message }));
			}, n.onupgradeneeded = (e) => {
				let t = e.target.result;
				switch (e.oldVersion) {
					case 0: t.createObjectStore(U, { keyPath: "compositeKey" });
				}
			};
		} catch (e) {
			t(z.create("storage-open", { originalErrorMessage: e?.message }));
		}
	}), W);
}
function dn(e) {
	return gn(_n(e));
}
function fn(e, t) {
	return hn(_n(e), t);
}
function pn(e) {
	return hn(ln, e);
}
function mn() {
	return gn(ln);
}
async function hn(e, t) {
	let n = (await un()).transaction(U, "readwrite"), r = n.objectStore(U).put({
		compositeKey: e,
		value: t
	});
	return new Promise((e, t) => {
		r.onsuccess = (t) => {
			e();
		}, n.onerror = (e) => {
			t(z.create("storage-set", { originalErrorMessage: e.target.error?.message }));
		};
	});
}
async function gn(e) {
	let t = (await un()).transaction(U, "readonly"), n = t.objectStore(U).get(e);
	return new Promise((e, r) => {
		n.onsuccess = (t) => {
			let n = t.target.result;
			e(n ? n.value : void 0);
		}, t.onerror = (e) => {
			r(z.create("storage-get", { originalErrorMessage: e.target.error?.message }));
		};
	});
}
function _n(e) {
	return `${e.options.appId}-${e.name}`;
}
var G = new Ae("@firebase/app-check");
async function vn(e) {
	if (m()) {
		let t;
		try {
			t = await dn(e);
		} catch (e) {
			G.warn(`Failed to read token from IndexedDB. Error: ${e}`);
		}
		return t;
	}
}
function K(e, t) {
	return m() ? fn(e, t).catch((e) => {
		G.warn(`Failed to write token to IndexedDB. Error: ${e}`);
	}) : Promise.resolve();
}
async function yn() {
	let e;
	try {
		e = await mn();
	} catch {}
	if (e) return e;
	{
		let e = crypto.randomUUID();
		return pn(e).catch((e) => G.warn(`Failed to persist debug token to IndexedDB. Error: ${e}`)), e;
	}
}
function q() {
	return R().enabled;
}
async function J() {
	let e = R();
	if (e.enabled && e.token) return e.token.promise;
	throw Error("\n            Can't get debug token in production mode.\n        ");
}
function bn() {
	let e = ie(), t = R();
	if (t.initialized = !0, typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN != "string" && e.FIREBASE_APPCHECK_DEBUG_TOKEN !== !0) return;
	t.enabled = !0;
	let n = new p();
	t.token = n, typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN == "string" ? n.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN) : n.resolve(yn());
}
var xn = { error: "UNKNOWN_ERROR" };
function Sn(e) {
	return f.encodeString(JSON.stringify(e), !1);
}
async function Y(e, t = !1, n = !1) {
	let r = e.app;
	B(r);
	let i = L(r), a = i.token, o;
	if (a && !X(a) && (i.token = void 0, a = void 0), !a) {
		let e = await i.cachedTokenPromise;
		e && (X(e) ? a = e : await K(r, void 0));
	}
	if (!t && a && X(a)) return { token: a.token };
	let s = !1;
	if (q()) try {
		let t = await J();
		i.exchangeTokenPromise || (i.exchangeTokenPromise = H(on(r, t), e.heartbeatServiceProvider).finally(() => {
			i.exchangeTokenPromise = void 0;
		}), s = !0);
		let n = await i.exchangeTokenPromise;
		return await K(r, n), i.token = n, { token: n.token };
	} catch (e) {
		return e.code === "appCheck/throttled" || e.code === "appCheck/initial-throttle" ? G.warn(e.message) : n && G.error(e), Z(e);
	}
	try {
		i.exchangeTokenPromise || (i.exchangeTokenPromise = i.provider.getToken().finally(() => {
			i.exchangeTokenPromise = void 0;
		}), s = !0), a = await L(r).exchangeTokenPromise;
	} catch (e) {
		e.code === "appCheck/throttled" || e.code === "appCheck/initial-throttle" ? G.warn(e.message) : n && G.error(e), o = e;
	}
	let c;
	return a ? o ? c = X(a) ? {
		token: a.token,
		internalError: o
	} : Z(o) : (c = { token: a.token }, i.token = a, await K(r, a)) : c = Z(o), s && On(r, c), c;
}
async function Cn(e) {
	let t = e.app;
	B(t);
	let { provider: n } = L(t);
	if (q()) {
		let { token: n } = await H(on(t, await J()), e.heartbeatServiceProvider);
		return { token: n };
	} else {
		let { token: e } = await n.getToken();
		return { token: e };
	}
}
function wn(e, t, n, r) {
	let { app: i } = e, a = L(i), o = {
		next: n,
		error: r,
		type: t
	};
	if (a.tokenObservers = [...a.tokenObservers, o], a.token && X(a.token)) {
		let t = a.token;
		Promise.resolve().then(() => {
			n({ token: t.token }), En(e);
		}).catch(() => {});
	}
	a.cachedTokenPromise.then(() => En(e));
}
function Tn(e, t) {
	let n = L(e), r = n.tokenObservers.filter((e) => e.next !== t);
	r.length === 0 && n.tokenRefresher && n.tokenRefresher.isRunning() && n.tokenRefresher.stop(), n.tokenObservers = r;
}
function En(e) {
	let { app: t } = e, n = L(t), r = n.tokenRefresher;
	r || (r = Dn(e), n.tokenRefresher = r), !r.isRunning() && n.isTokenAutoRefreshEnabled && r.start();
}
function Dn(e) {
	let { app: t } = e;
	return new en(async () => {
		let n = L(t), r;
		if (r = n.token ? await Y(e, !0) : await Y(e), r.error) throw r.error;
		if (r.internalError) throw r.internalError;
	}, () => !0, () => {
		let e = L(t);
		if (e.token) {
			let t = e.token.issuedAtTimeMillis + (e.token.expireTimeMillis - e.token.issuedAtTimeMillis) * .5 + 300 * 1e3, n = e.token.expireTimeMillis - 300 * 1e3;
			return t = Math.min(t, n), Math.max(0, t - Date.now());
		} else return 0;
	}, Qt.RETRIAL_MIN_WAIT, Qt.RETRIAL_MAX_WAIT);
}
function On(e, t) {
	let n = L(e).tokenObservers;
	for (let e of n) try {
		e.type === "EXTERNAL" && t.error != null ? e.error(t.error) : e.next(t);
	} catch {}
}
function X(e) {
	return e.expireTimeMillis - Date.now() > 0;
}
function Z(e) {
	return {
		token: Sn(xn),
		error: e
	};
}
var kn = class {
	constructor(e, t) {
		this.app = e, this.heartbeatServiceProvider = t;
	}
	_delete() {
		let { tokenObservers: e } = L(this.app);
		for (let t of e) Tn(this.app, t.next);
		return Promise.resolve();
	}
};
function An(e, t) {
	return new kn(e, t);
}
function jn(e) {
	return {
		getToken: (t) => Y(e, t),
		getLimitedUseToken: () => Cn(e),
		addTokenListener: (t) => wn(e, "INTERNAL", t),
		removeTokenListener: (t) => Tn(e.app, t)
	};
}
var Mn = "@firebase/app-check", Nn = "0.11.2", Pn = "https://www.google.com/recaptcha/enterprise.js";
function Fn(e, t) {
	let n = new p(), r = L(e);
	r.reCAPTCHAState = { initialized: n };
	let i = In(e), a = nn(!0);
	return a ? Q(e, t, a, i, n) : zn(() => {
		let r = nn(!0);
		if (!r) throw Error("no recaptcha");
		Q(e, t, r, i, n);
	}), n.promise;
}
function Q(e, t, n, r, i) {
	n.ready(() => {
		Rn(e, t, n, r), i.resolve(n);
	});
}
function In(e) {
	let t = `fire_app_check_${e.name}`, n = document.createElement("div");
	return n.id = t, n.style.display = "none", document.body.appendChild(n), t;
}
async function Ln(e) {
	B(e);
	let t = await L(e).reCAPTCHAState.initialized.promise;
	return new Promise((n, r) => {
		let i = L(e).reCAPTCHAState;
		t.ready(() => {
			n(t.execute(i.widgetId, { action: "fire_app_check" }));
		});
	});
}
function Rn(e, t, n, r) {
	let i = n.render(r, {
		sitekey: t,
		size: "invisible",
		callback: () => {
			L(e).reCAPTCHAState.succeeded = !0;
		},
		"error-callback": () => {
			L(e).reCAPTCHAState.succeeded = !1;
		}
	}), a = L(e);
	a.reCAPTCHAState = {
		...a.reCAPTCHAState,
		widgetId: i
	};
}
function zn(e) {
	let t = document.createElement("script");
	t.src = Pn, t.onload = e, document.head.appendChild(t);
}
var Bn = class e {
	constructor(e) {
		this._siteKey = e, this._throttleData = null;
	}
	async getToken() {
		Hn(this._throttleData);
		let e = await Ln(this._app).catch((e) => {
			throw z.create("recaptcha-error");
		});
		if (!L(this._app).reCAPTCHAState?.succeeded) throw z.create("recaptcha-error");
		let t;
		try {
			t = await H(an(this._app, e), this._heartbeatServiceProvider);
		} catch (e) {
			throw e.code?.includes("fetch-status-error") ? (this._throttleData = Vn(Number(e.customData?.httpStatus), this._throttleData), z.create("initial-throttle", {
				time: rn(this._throttleData.allowRequestsAfter - Date.now()),
				httpStatus: this._throttleData.httpStatus
			})) : e;
		}
		return this._throttleData = null, t;
	}
	initialize(e) {
		this._app = e, this._heartbeatServiceProvider = Et(e, "heartbeat"), Fn(e, this._siteKey).catch(() => {});
	}
	isEqual(t) {
		return t instanceof e ? this._siteKey === t._siteKey : !1;
	}
};
function Vn(e, t) {
	if (e === 404 || e === 403) return {
		backoffCount: 1,
		allowRequestsAfter: Date.now() + $t,
		httpStatus: e
	};
	{
		let n = t ? t.backoffCount : 0, r = ye(n, 1e3, 2);
		return {
			backoffCount: n + 1,
			allowRequestsAfter: Date.now() + r,
			httpStatus: e
		};
	}
}
function Hn(e) {
	if (e && Date.now() - e.allowRequestsAfter <= 0) throw z.create("throttled", {
		time: rn(e.allowRequestsAfter - Date.now()),
		httpStatus: e.httpStatus
	});
}
function Un(e = kt(), t) {
	e = be(e);
	let n = Et(e, "app-check");
	if (R().initialized || bn(), q() && J().then((e) => console.log(`App Check debug token: ${e}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`)), n.isInitialized()) {
		let r = n.getImmediate(), i = n.getOptions();
		if (i.isTokenAutoRefreshEnabled === t.isTokenAutoRefreshEnabled && i.provider.isEqual(t.provider)) return r;
		throw z.create("already-initialized", { appName: e.name });
	}
	let r = n.initialize({ options: t });
	return Wn(e, t.provider, t.isTokenAutoRefreshEnabled), L(e).isTokenAutoRefreshEnabled && wn(r, "INTERNAL", () => {}), r;
}
function Wn(e, t, n = !1) {
	let r = Jt(e, { ...Kt });
	r.activated = !0, r.provider = t, r.cachedTokenPromise = vn(e).then((t) => (t && X(t) && (r.token = t, On(e, { token: t.token })), t)), r.isTokenAutoRefreshEnabled = n && e.automaticDataCollectionEnabled, !e.automaticDataCollectionEnabled && n && G.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."), r.provider.initialize(e);
}
var Gn = "app-check", Kn = "app-check-internal";
function qn() {
	M(new v(Gn, (e) => An(e.getProvider("app").getImmediate(), e.getProvider("heartbeat")), "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e, t, n) => {
		e.getProvider(Kn).initialize();
	})), M(new v(Kn, (e) => jn(e.getProvider("app-check").getImmediate()), "PUBLIC").setInstantiationMode("EXPLICIT")), P(Mn, Nn);
}
qn();
//#endregion
//#region backends/firebase.js
function $(e) {
	if (!e) return;
	let t = {
		description: e.description,
		nullable: e.nullable || !1,
		format: e.format
	};
	switch (Array.isArray(e.type) && e.type.includes("null") && (t.nullable = !0, e.type = e.type.find((e) => e !== "null")), e.type) {
		case "string": return e.enum && Array.isArray(e.enum) ? a.enumString({
			...t,
			enum: e.enum
		}) : a.string(t);
		case "number": return a.number(t);
		case "integer": return a.integer(t);
		case "boolean": return a.boolean(t);
		case "array": return a.array({
			...t,
			items: $(e.items)
		});
		case "object": {
			let n = {}, r = e.properties ? Object.keys(e.properties) : [];
			r.forEach((t) => {
				n[t] = $(e.properties[t]);
			});
			let i = e.required || [], o = r.filter((e) => !i.includes(e));
			return a.object({
				...t,
				properties: n,
				optionalProperties: o
			});
		}
		default: return console.warn(`Unsupported type: ${e.type}, defaulting to string.`), a.string(t);
	}
}
var Jn = class extends e {
	#e;
	#t;
	constructor(e) {
		let { geminiApiProvider: i, modelName: a, useAppCheck: c, reCaptchaSiteKey: l, useLimitedUseAppCheckTokens: u, ...d } = e;
		super(a || t.firebase.modelName);
		let f = n(d);
		c && l && Un(f, {
			provider: new Bn(l),
			isTokenAutoRefreshEnabled: !0
		}), this.#t = s(f, {
			backend: i === "vertex" ? new o() : new r(),
			useLimitedUseAppCheckTokens: u || !0
		});
	}
	convertSchema(e) {
		return $(e);
	}
	createSession(e, t) {
		return this.#e = c(this.#t, {
			mode: i.ONLY_IN_CLOUD,
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
export { Jn as default };
