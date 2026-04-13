import { BundleFileOutput } from "./BundleFileOutput.js";
import debugUtil from "debug";

const debug = debugUtil("Eleventy:Bundle");
const DEBUG_LOG_TRUNCATION_SIZE = 200;

class CodeManager {
	// code is placed in this bucket by default
	static DEFAULT_BUCKET_NAME = "default";

	// code is hoisted to this bucket when necessary
	static HOISTED_BUCKET_NAME = "default";

	constructor(name) {
		this.name = name;
		this.trimOnAdd = true;
		// TODO unindent on add
		this.reset();
		this.transforms = [];
		this.isHoisting = true;
		this.fileExtension = undefined;
		this.toFileDirectory = undefined;
		this.bundleExportKey = "bundle";
		this.runsAfterHtmlTransformer = false;
		this.pluckedSelector = undefined;
	}

	setDelayed(isDelayed) {
		this.runsAfterHtmlTransformer = Boolean(isDelayed);
	}

	isDelayed() {
		return this.runsAfterHtmlTransformer;
	}

	// posthtml-match-selector friendly
	setPluckedSelector(selector) {
		this.pluckedSelector = selector;
	}

	getPluckedSelector() {
		return this.pluckedSelector;
	}

	setFileExtension(ext) {
		this.fileExtension = ext;
	}

	setHoisting(enabled) {
		this.isHoisting = !!enabled;
	}

	setBundleDirectory(dir) {
		this.toFileDirectory = dir;
	}

	setBundleExportKey(key) {
		this.bundleExportKey = key;
	}

	getBundleExportKey() {
		return this.bundleExportKey;
	}

	reset() {
		this.pages = {};
	}

	static normalizeBuckets(bucket) {
		if(Array.isArray(bucket)) {
			return bucket;
		} else if(typeof bucket === "string") {
			return bucket.split(",");
		}
		return [CodeManager.DEFAULT_BUCKET_NAME];
	}

	setTransforms(transforms) {
		if(!Array.isArray(transforms)) {
			throw new Error("Array expected to setTransforms");
		}

		this.transforms = transforms;
	}

	_initBucket(pageUrl, bucket) {
		if(!this.pages[pageUrl][bucket]) {
			this.pages[pageUrl][bucket] = new Set();
		}
	}

	addToPage(pageUrl, code = [], bucket) {
		if(!Array.isArray(code) && code) {
			code = [code];
		}
		if(code.length === 0) {
			return;
		}

		if(!this.pages[pageUrl]) {
			this.pages[pageUrl] = {};
		}

		let buckets = CodeManager.normalizeBuckets(bucket);

		let codeContent = code.map(entry => {
			if(this.trimOnAdd) {
				return entry.trim();
			}
			return entry;
		});


		for(let b of buckets) {
			this._initBucket(pageUrl, b);

			for(let content of codeContent) {
				if(content) {
					if(!this.pages[pageUrl][b].has(content)) {
						debug("Adding code to bundle %o for %o (bucket: %o, size: %o): %o", this.name, pageUrl, b, content.length, content.length > DEBUG_LOG_TRUNCATION_SIZE ? content.slice(0, DEBUG_LOG_TRUNCATION_SIZE) + "…" : content);
						this.pages[pageUrl][b].add(content);
					}
				}
			}
		}
	}

	async runTransforms(str, pageData, buckets) {
		for (let callback of this.transforms) {
			str = await callback.call(
				{
					page: pageData,
					type: this.name,
					buckets: buckets
				},
				str
			);
		}

		return str;
	}

	getBucketsForPage(pageData) {
		let pageUrl = pageData.url;
		if(!this.pages[pageUrl]) {
			return [];
		}
		return Object.keys(this.pages[pageUrl]);
	}

	getRawForPage(pageData, buckets = undefined) {
		let url = pageData.url;
		if(!this.pages[url]) {
			debug("No bundle code found for %o on %o, %O", this.name, url, this.pages);
			return new Set();
		}

		buckets = CodeManager.normalizeBuckets(buckets);

		let set = new Set();
		let size = 0;
		for(let b of buckets) {
			if(!this.pages[url][b]) {
				// Just continue, if you retrieve code from a bucket that doesn’t exist or has no code, it will return an empty set
				continue;
			}

			for(let entry of this.pages[url][b]) {
				size += entry.length;
				set.add(entry);
			}
		}

		debug("Retrieving %o for %o (buckets: %o, entries: %o, size: %o)", this.name, url, buckets, set.size, size);
		return set;
	}

	async getForPage(pageData, buckets = undefined) {
		let set = this.getRawForPage(pageData, buckets);
		let bundleContent = Array.from(set).join("\n");

		// returns promise
		return this.runTransforms(bundleContent, pageData, buckets);
	}

	async writeBundle(pageData, buckets, options = {}) {
		let url = pageData.url;
		if(!this.pages[url]) {
			debug("No bundle code found for %o on %o, %O", this.name, url, this.pages);
			return "";
		}

		let { output, write } = options;

		buckets = CodeManager.normalizeBuckets(buckets);

		// TODO the bundle output URL might be useful in the transforms for sourcemaps
		let content = await this.getForPage(pageData, buckets);
		let writer = new BundleFileOutput(output, this.toFileDirectory);
		writer.setFileExtension(this.fileExtension);
		return writer.writeBundle(content, this.name, write);
	}

	// Used when a bucket is output multiple times on a page and needs to be hoisted
	hoistBucket(pageData, bucketName) {
		let newTargetBucketName = CodeManager.HOISTED_BUCKET_NAME;
		if(!this.isHoisting || bucketName === newTargetBucketName) {
			return;
		}

		let url = pageData.url;
		if(!this.pages[url] || !this.pages[url][bucketName]) {
			debug("No bundle code found for %o on %o, %O", this.name, url, this.pages);
			return;
		}

		debug("Code in bucket (%o) is being hoisted to a new bucket (%o)", bucketName, newTargetBucketName);

		this._initBucket(url, newTargetBucketName);

		for(let codeEntry of this.pages[url][bucketName]) {
			this.pages[url][bucketName].delete(codeEntry);
			this.pages[url][newTargetBucketName].add(codeEntry);
		}

		// delete the bucket
		delete this.pages[url][bucketName];
	}
}

export { CodeManager };
