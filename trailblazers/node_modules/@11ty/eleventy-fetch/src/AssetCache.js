const fs = require("node:fs");
const path = require("node:path");
const { DateCompare, createHashHexSync } = require("@11ty/eleventy-utils");

const FileCache = require("./FileCache.js");
const Sources = require("./Sources.js");

const debugUtil = require("debug");
const debug = debugUtil("Eleventy:Fetch");

class AssetCache {
	#source;
	#hash;
	#customFilename;
	#cache;
	#cacheDirectory;
	#cacheLocationDirty = false;
	#directoryManager;

	constructor(source, cacheDirectory, options = {}) {
		if(!Sources.isValidSource(source)) {
			throw Sources.getInvalidSourceError(source);
		}

		let uniqueKey = AssetCache.getCacheKey(source, options);
		this.uniqueKey = uniqueKey;
		this.hash = AssetCache.getHash(uniqueKey, options.hashLength);

		this.cacheDirectory = cacheDirectory || ".cache";
		this.options = options;

		this.defaultDuration = "1d";
		this.duration = options.duration || this.defaultDuration;

		// Compute the filename only once
		if (typeof this.options.filenameFormat === "function") {
			this.#customFilename = AssetCache.cleanFilename(this.options.filenameFormat(uniqueKey, this.hash));

			if (typeof this.#customFilename !== "string" || this.#customFilename.length === 0) {
				throw new Error(`The provided filenameFormat callback function needs to return valid filename characters.`);
			}
		}
	}

	log(message) {
		if (this.options.verbose) {
			console.log(`[11ty/eleventy-fetch] ${message}`);
		} else {
			debug(message);
		}
	}

	static cleanFilename(filename) {
		// Ensure no illegal characters are present (Windows or Linux: forward/backslash, chevrons, colon, double-quote, pipe, question mark, asterisk)
		if (filename.match(/([\/\\<>:"|?*]+?)/)) {
			let sanitizedFilename = filename.replace(/[\/\\<>:"|?*]+/g, "");
			debug(
				`[@11ty/eleventy-fetch] Some illegal characters were removed from the cache filename: ${filename} will be cached as ${sanitizedFilename}.`,
			);
			return sanitizedFilename;
		}

		return filename;
	}

	static getCacheKey(source, options) {
		// RemoteAssetCache passes in a string here, which skips this check (requestId is already used upstream)
		if (Sources.isValidComplexSource(source)) {
			if(options.requestId) {
				return options.requestId;
			}

			if(typeof source.toString === "function") {
				// 	return source.toString();
				let toStr = source.toString();
				if(toStr !== "function() {}" && toStr !== "[object Object]") {
					return toStr;
				}
			}

			throw Sources.getInvalidSourceError(source);
		}

		return source;
	}

	// Defult hashLength also set in global options, duplicated here for tests
	// v5.0+ key can be Array or literal
	static getHash(key, hashLength = 30) {
		if (!Array.isArray(key)) {
			key = [key];
		}

		let result = createHashHexSync(...key);
		return result.slice(0, hashLength);
	}

	get source() {
		return this.#source;
	}

	set source(source) {
		this.#source = source;
	}

	get hash() {
		return this.#hash;
	}

	set hash(value) {
		if (value !== this.#hash) {
			this.#cacheLocationDirty = true;
		}

		this.#hash = value;
	}

	get cacheDirectory() {
		return this.#cacheDirectory;
	}

	set cacheDirectory(dir) {
		if (dir !== this.#cacheDirectory) {
			this.#cacheLocationDirty = true;
		}

		this.#cacheDirectory = dir;
	}

	get cacheFilename() {
		if (typeof this.#customFilename === "string" && this.#customFilename.length > 0) {
			return this.#customFilename;
		}

		return `eleventy-fetch-${this.hash}`;
	}

	get rootDir() {
		// Work in an AWS Lambda (serverless)
		// https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html

		// Bad: LAMBDA_TASK_ROOT is /var/task/ on AWS so we must use ELEVENTY_ROOT
		// When using ELEVENTY_ROOT, cacheDirectory must be relative
		// (we are bundling the cache files into the serverless function)
		if (
			process.env.LAMBDA_TASK_ROOT &&
			process.env.ELEVENTY_ROOT &&
			!this.cacheDirectory.startsWith("/")
		) {
			return path.resolve(process.env.ELEVENTY_ROOT, this.cacheDirectory);
		}

		// otherwise, it is recommended to use somewhere in /tmp/ for serverless (otherwise it won’t write)
		return path.resolve(this.cacheDirectory);
	}

	get cachePath() {
		return path.join(this.rootDir, this.cacheFilename);
	}

	get cache() {
		if (!this.#cache || this.#cacheLocationDirty) {
			let cache = new FileCache(this.cacheFilename, {
				dir: this.rootDir,
				source: this.source,
			});
			cache.setDefaultType(this.options.type);
			cache.setDryRun(this.options.dryRun);
			cache.setDirectoryManager(this.#directoryManager);

			this.#cache = cache;
			this.#cacheLocationDirty = false;
		}
		return this.#cache;
	}

	getDurationMs(duration = "0s") {
		return DateCompare.getDurationMs(duration);
	}

	setDirectoryManager(manager) {
		this.#directoryManager = manager;
	}

	async save(contents, type = "buffer", metadata = {}) {
		if(!contents) {
			throw new Error("save(contents) expects contents (was falsy)");
		}

		this.cache.set(type, contents, metadata);

		// Dry-run handled downstream
		this.cache.save();
	}

	getCachedContents() {
		return this.cache.getContents();
	}

	getCachedValue() {
		if(this.options.returnType === "response") {
			return {
				...this.cachedObject.metadata?.response,
				body: this.getCachedContents(),
				cache: "hit",
			}
		}

		return this.getCachedContents();
	}

	getCachedTimestamp() {
		return this.cachedObject?.cachedAt;
	}

	isCacheValid(duration = this.duration) {
		if(!this.cachedObject || !this.cachedObject?.cachedAt) {
			return false;
		}

		if(this.cachedObject?.type && DateCompare.isTimestampWithinDuration(this.cachedObject?.cachedAt, duration)) {
			return this.cache.hasContents(this.cachedObject?.type); // check file system to make files haven’t been purged.
		}

		return false;
	}

	get cachedObject() {
		return this.cache.get();
	}

	// Deprecated
	needsToFetch(duration) {
		return !this.isCacheValid(duration);
	}

	// This is only included for completenes—not on the docs.
	async fetch(optionsOverride = {}) {
		if (this.isCacheValid(optionsOverride.duration)) {
			// promise
			debug(`Using cached version of: ${this.uniqueKey}`);
			return this.getCachedValue();
		}

		debug(`Saving ${this.uniqueKey} to ${this.cacheFilename}`);
		await this.save(this.source, optionsOverride.type);

		return this.source;
	}

	// for testing
	hasAnyCacheFiles() {
		for(let p of this.cache.getAllPossibleFilePaths()) {
			if(fs.existsSync(p)) {
				return true;
			}
		}
		return false;
	}

	// for testing
	async destroy() {
		await Promise.all(this.cache.getAllPossibleFilePaths().map(path => {
			if (fs.existsSync(path)) {
				return fs.unlinkSync(path);
			}
		}))
	}
}
module.exports = AssetCache;
