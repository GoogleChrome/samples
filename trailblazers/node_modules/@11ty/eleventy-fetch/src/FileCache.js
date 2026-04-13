const fs = require("node:fs");
const path = require("node:path");
const debugUtil = require("debug");
const { parse } = require("flatted");

const debug = debugUtil("Eleventy:Fetch");
const debugAssets = debugUtil("Eleventy:Assets");

const DirectoryManager = require("./DirectoryManager.js");
const ExistsCache = require("./ExistsCache.js");

let existsCache = new ExistsCache();

class FileCache {
	#source;
	#directoryManager;
	#metadata;
	#defaultType;
	#contents;
	#dryRun = false;
	#cacheDirectory = ".cache";
	#savePending = false;
	#counts = {
		read: 0,
		write: 0,
	};

	constructor(cacheFilename, options = {}) {
		this.cacheFilename = cacheFilename;
		if(options.dir) {
			this.#cacheDirectory = options.dir;
		}
		if(options.source) {
			this.#source = options.source;
		}
	}

	setDefaultType(type) {
		if(type) {
			this.#defaultType = type;
		}
	}

	setDryRun(val) {
		this.#dryRun = Boolean(val);
	}

	setDirectoryManager(manager) {
		this.#directoryManager = manager;
	}

	ensureDir() {
		if (this.#dryRun || existsCache.exists(this.#cacheDirectory)) {
			return;
		}

		if(!this.#directoryManager) {
			// standalone fallback (for tests)
			this.#directoryManager = new DirectoryManager();
		}

		this.#directoryManager.create(this.#cacheDirectory);
	}

	set(type, contents, extraMetadata = {}) {
		this.#savePending = true;

		this.#metadata = {
			cachedAt: Date.now(),
			type,
			// source: this.#source,
			metadata: extraMetadata,
		};

		this.#contents = contents;
	}

	get fsPath() {
		return path.join(this.#cacheDirectory, this.cacheFilename);
	}

	getContentsPath(type) {
		if(!type) {
			throw new Error("Missing cache type for " + this.fsPath);
		}

		// normalize to storage type
		if(type === "xml") {
			type = "text";
		} else if(type === "parsed-xml") {
			type = "json";
		}

		return `${this.fsPath}.${type}`;
	}

	// only when side loaded (buffer content)
	get contentsPath() {
		return this.getContentsPath(this.#metadata?.type);
	}

	get() {
		if(this.#metadata) {
			return this.#metadata;
		}

		if(!existsCache.exists(this.fsPath)) {
			return;
		}

		debug(`Fetching from cache ${this.fsPath}`);
		if(this.#source) {
			debugAssets("[11ty/eleventy-fetch] Reading via %o", this.#source);
		} else {
			debugAssets("[11ty/eleventy-fetch] Reading %o", this.fsPath);
		}

		this.#counts.read++;
		let data = fs.readFileSync(this.fsPath, "utf8");

		let json;
		// Backwards compatibility with previous caches usingn flat-cache and `flatted`
		if(data.startsWith(`[["1"],`)) {
			let flattedParsed = parse(data);
			if(flattedParsed?.[0]?.value) {
				json = flattedParsed?.[0]?.value
			}
		} else {
			json = JSON.parse(data);
		}

		this.#metadata = json;

		return json;
	}

	_backwardsCompatGetContents(rawData, type) {
		if (type === "json") {
			return rawData.contents;
		} else if (type === "text") {
			return rawData.contents.toString();
		}

		// buffer
		return Buffer.from(rawData.contents);
	}

	hasContents(type) {
		if(this.#contents) {
			return true;
		}
		if(this.get()?.contents) { // backwards compat with very old caches
			return true;
		}
		return existsCache.exists(this.getContentsPath(type));
	}

	getType() {
		return this.#metadata?.type || this.#defaultType;
	}

	getContents() {
		if(this.#contents) {
			return this.#contents;
		}

		let metadata = this.get();
		// backwards compat with old caches
		if(metadata?.contents) {
			// already parsed, part of the top level file
			let normalizedContent = this._backwardsCompatGetContents(this.get(), this.getType());
			this.#contents = normalizedContent;
			return normalizedContent;
		}

		if(!existsCache.exists(this.contentsPath)) {
			return;
		}

		debug(`Fetching from cache ${this.contentsPath}`);
		if(this.#source) {
			debugAssets("[11ty/eleventy-fetch] Reading (side loaded) via %o", this.#source);
		} else {
			debugAssets("[11ty/eleventy-fetch] Reading (side loaded) %o", this.contentsPath);
		}

		// It is intentional to store contents in a separate file from the metadata: we don’t want to
		// have to read the entire contents via JSON.parse (or otherwise) to check the cache validity.
		this.#counts.read++;
		let type = metadata?.type || this.getType();
		let data = fs.readFileSync(this.contentsPath);
		if (type === "json" || type === "parsed-xml") {
			data = JSON.parse(data);
		}
		this.#contents = data;
		return data;
	}

	save() {
		if(this.#dryRun || !this.#savePending || this.#metadata && Object.keys(this.#metadata) === 0) {
			return;
		}

		this.ensureDir(); // doesn’t add to counts (yet?)

		// contents before metadata
		debugAssets("[11ty/eleventy-fetch] Writing %o (side loaded) from %o", this.contentsPath, this.#source);

		this.#counts.write++;
		// the contents must exist before the cache metadata are saved below
		let contents = this.#contents;
		let type = this.getType();
		if (type === "json" || type === "parsed-xml") {
			contents = JSON.stringify(contents);
		}
		fs.writeFileSync(this.contentsPath, contents);
		debug(`Writing ${this.contentsPath}`);

		this.#counts.write++;
		debugAssets("[11ty/eleventy-fetch] Writing %o from %o", this.fsPath, this.#source);
		fs.writeFileSync(this.fsPath, JSON.stringify(this.#metadata), "utf8");
		debug(`Writing ${this.fsPath}`);
	}

	// for testing
	getAllPossibleFilePaths() {
		let types = ["text", "buffer", "json"];
		let paths = new Set();
		paths.add(this.fsPath);
		for(let type of types) {
			paths.add(this.getContentsPath(type));
		}
		return Array.from(paths);
	}
}

module.exports = FileCache;
