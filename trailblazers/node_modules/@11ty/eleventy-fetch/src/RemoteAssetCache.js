const debugUtil = require("debug");
const { parseXml } = require('@rgrove/parse-xml');

const Sources = require("./Sources.js");
const AssetCache = require("./AssetCache.js");

const debug = debugUtil("Eleventy:Fetch");
const debugAssets = debugUtil("Eleventy:Assets");

class RemoteAssetCache extends AssetCache {
	#queue;
	#queuePromise;
	#fetchPromise;
	#lastFetchType;

	constructor(source, cacheDirectory, options = {}) {
		let requestId = RemoteAssetCache.getRequestId(source, options);
		super(requestId, cacheDirectory, options);

		this.source = source;
		this.options = options;
		this.displayUrl = RemoteAssetCache.convertUrlToString(source, options);
		this.fetchCount = 0;
	}

	static getRequestId(source, options = {}) {
		if (Sources.isValidComplexSource(source)) {
			return this.getCacheKey(source, options);
		}

		if (options.removeUrlQueryParams) {
			let cleaned = this.cleanUrl(source);
			return this.getCacheKey(cleaned, options);
		}

		return this.getCacheKey(source, options);
	}

	static getCacheKey(source, options) {
		let cacheKey = {
			source: AssetCache.getCacheKey(source, options),
		};

		if(options.type === "xml" || options.type === "parsed-xml") {
			cacheKey.type = options.type;
		}

		if (options.fetchOptions) {
			if (options.fetchOptions.method && options.fetchOptions.method !== "GET") {
				cacheKey.method = options.fetchOptions.method;
			}
			if (options.fetchOptions.body) {
				cacheKey.body = options.fetchOptions.body;
			}
		}

		if(Object.keys(cacheKey).length > 1) {
			return JSON.stringify(cacheKey);
		}

		return cacheKey.source;
	}

	static cleanUrl(url) {
		if(!Sources.isFullUrl(url)) {
			return url;
		}

		let cleanUrl;
		if(typeof url === "string" || typeof url.toString === "function") {
			cleanUrl = new URL(url);
		} else if(url instanceof URL) {
			cleanUrl = url;
		} else {
			throw new Error("Invalid source for cleanUrl: " + url)
		}

		cleanUrl.search = new URLSearchParams([]);

		return cleanUrl.toString();
	}

	static convertUrlToString(source, options = {}) {
		// removes query params
		source = RemoteAssetCache.cleanUrl(source);

		let { formatUrlForDisplay } = options;
		if (formatUrlForDisplay && typeof formatUrlForDisplay === "function") {
			return "" + formatUrlForDisplay(source);
		}

		return "" + source;
	}

	async getResponseValue(response, type) {
		if (type === "json") {
			return response.json();
		} else if (type === "text" || type === "xml") {
			return response.text();
		} else if(type === "parsed-xml") {
			return parseXml(await response.text());
		}
		return Buffer.from(await response.arrayBuffer());
	}

	setQueue(queue) {
		this.#queue = queue;
	}

	// Returns raw Promise
	queue() {
		if(!this.#queue) {
			throw new Error("Missing `#queue` instance.");
		}

		if(!this.#queuePromise) {
			// optionsOverride not supported on fetch here for re-use
			this.#queuePromise = this.#queue.add(() => this.fetch()).catch((e) => {
				this.#queuePromise = undefined;
				throw e;
			});
		}

		return this.#queuePromise;
	}

	isCacheValid(duration = undefined) {
		// uses this.options.duration if not explicitly defined here
		return super.isCacheValid(duration);
	}

	// if last fetch was a cache hit (no fetch occurred) or a cache miss (fetch did occur)
	// used by Eleventy Image in disk cache checks.
	wasLastFetchCacheHit() {
		return this.#lastFetchType === "hit";
	}

	async #fetch(optionsOverride = {}) {
		// Important: no disk writes when dryRun
		// As of Fetch v4, reads are now allowed!
		if (this.isCacheValid(optionsOverride.duration)) {
			debug(`Cache hit for ${this.displayUrl}`);
			this.#lastFetchType = "hit";
			return super.getCachedValue();
		}

		this.#lastFetchType = "miss";

		try {
			let isDryRun = optionsOverride.dryRun || this.options.dryRun;
			this.log(`Fetching ${this.displayUrl}`);

			let body;
			let metadata = {};
			let type = optionsOverride.type || this.options.type;
			if (typeof this.source === "object" && typeof this.source.then === "function") {
				body = await this.source;
			} else if (typeof this.source === "function") {
				// sync or async function
				body = await this.source();
			} else {
				let fetchOptions = optionsOverride.fetchOptions || this.options.fetchOptions || {};
				if(!Sources.isFullUrl(this.source)) {
					throw Sources.getInvalidSourceError(this.source);
				}

				this.fetchCount++;

				debugAssets("[11ty/eleventy-fetch] Fetching %o", this.source);

				// v5: now using global (Node-native or otherwise) fetch instead of node-fetch
				let response = await fetch(this.source, fetchOptions);
				if (!response.ok) {
					throw new Error(
						`Bad response for ${this.displayUrl} (${response.status}): ${response.statusText}`,
						{ cause: response },
					);
				}

				metadata.response = {
					url: response.url,
					status: response.status,
					headers:  Object.fromEntries(response.headers.entries()),
				};

				body = await this.getResponseValue(response, type);
			}

			if (!isDryRun) {
				await super.save(body, type, metadata);
			}

			if(this.options.returnType === "response") {
				return {
					...metadata.response,
					body,
					cache: "miss",
				}
			}

			return body;
		} catch (e) {
			if (this.cachedObject && this.getDurationMs(this.duration) > 0) {
				debug(`Error fetching ${this.displayUrl}. Message: ${e.message}`);
				debug(`Failing gracefully with an expired cache entry.`);
				return super.getCachedValue();
			} else {
				return Promise.reject(e);
			}
		}
	}

	// async but not explicitly declared for promise equality checks
	// returns a Promise
	async fetch(optionsOverride = {}) {
		if(!this.#fetchPromise) {
			// one at a time. clear when finished
			this.#fetchPromise = this.#fetch(optionsOverride).finally(() => {
				this.#fetchPromise = undefined;
			});
		}

		return this.#fetchPromise;
	}
}
module.exports = RemoteAssetCache;
