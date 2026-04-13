const { base64UrlSafe } = require("./Url.js");
const { isBuffer } = require("./Buffer.js");
const sha256 = require("./lib-sha256.js");

function hasNodeCryptoModule() {
	try {
		require("node:crypto");
		return true;
	} catch(e) {
		return false;
	}
}

const HAS_NODE_CRYPTO = hasNodeCryptoModule();

class Hash {
	static create() {
		if(typeof globalThis.crypto === "undefined") {
			// Backwards compat with Node Crypto, since WebCrypto (crypto global) is Node 20+
			if(HAS_NODE_CRYPTO) {
				return NodeCryptoHash;
			}
			return ScriptHash;
		}
		return WebCryptoHash;
	}

	// Does not use WebCrypto (as WebCrypto is async-only)
	static createSync() {
		if(HAS_NODE_CRYPTO) {
			return NodeCryptoHash;
		}
		return ScriptHash;
	}

	static toBase64(bytes) {
		let str = Array.from(bytes, (b) => String.fromCodePoint(b)).join("");

		// `btoa` Node 16+
		return btoa(str);
	}

	// Thanks https://evanhahn.com/the-best-way-to-concatenate-uint8arrays/ (Public domain)
	static mergeUint8Array(...arrays) {
		let totalLength = arrays.reduce(
			(total, uint8array) => total + uint8array.byteLength,
			0
		);

		let result = new Uint8Array(totalLength);
		let offset = 0;
		arrays.forEach((uint8array) => {
			result.set(uint8array, offset);
			offset += uint8array.byteLength;
		});

		return result;
	}

	static bufferToBase64Url(hashBuffer) {
		return base64UrlSafe(this.toBase64(new Uint8Array(hashBuffer)));
	}

	static bufferToHex(hashBuffer) {
		return Array.from(new Uint8Array(hashBuffer))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
	}
}

class WebCryptoHash extends Hash {
	static async toHash(...content) {
		let encoder = new TextEncoder();
		let input = this.mergeUint8Array(...content.map(c => {
			if(isBuffer(c)) {
				return c;
			}
			return encoder.encode(c);
		}));

		// `crypto` is Node 20+
		return crypto.subtle.digest("SHA-256", input);
	}

	static async toBase64Url(...content) {
		return this.toHash(...content).then(hashBuffer => {
			return this.bufferToBase64Url(hashBuffer);
		});
	}

	static async toHex(...content) {
		return this.toHash(...content).then(hashBuffer => {
			return this.bufferToHex(hashBuffer);
		});
	}

	static toBase64UrlSync() {
		throw new Error("Synchronous methods are not available in the Web Crypto API.");
	}

	static toHexSync() {
		throw new Error("Synchronous methods are not available in the Web Crypto API.");
	}
}

class NodeCryptoHash extends Hash {
	static toHash(...content) {
		// This *needs* to be a dynamic require for proper bundling.
		const { createHash } = require("node:crypto");
		let hash = createHash("sha256");

		for(let c of content) {
			hash.update(c);
		}

		return hash;
	}

	static toBase64Url(...content) {
		// Note that Node does include a `digest("base64url")` that is supposedly Node 14+ but curiously failed on Stackblitz’s Node 16.
		let base64 = this.toHash(...content).digest("base64");
		return base64UrlSafe(base64);
	}

	static toHex(...content) {
		return this.toHash(...content).digest("hex");
	}

	// aliases
	static toBase64UrlSync = this.toBase64Url;
	static toHexSync = this.toHex;
}

class ScriptHash extends Hash {
	static toHash(...content) {
		let hash = sha256();
		for(let c of content) {
			hash.add(c);
		}
		return hash.digest();
	}

	static toBase64Url(...content) {
		let hashBuffer = this.toHash(...content);
		return this.bufferToBase64Url(hashBuffer);
	}

	static toHex(...content) {
		let hashBuffer = this.toHash(...content);
		return this.bufferToHex(hashBuffer);
	}

	// aliases
	static toBase64UrlSync = this.toBase64Url;
	static toHexSync = this.toHex;
}

module.exports = { Hash, NodeCryptoHash, ScriptHash, WebCryptoHash }