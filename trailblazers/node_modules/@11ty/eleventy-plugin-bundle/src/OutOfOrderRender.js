import debugUtil from "debug";

const debug = debugUtil("Eleventy:Bundle");

/* This class defers any `bundleGet` calls to a post-build transform step,
 * to allow `getBundle` to be called before all of the `css` additions have been processed
 */
class OutOfOrderRender {
	static SPLIT_REGEX = /(\/\*__EleventyBundle:[^:]*:[^:]*:[^:]*:EleventyBundle__\*\/)/;
	static SEPARATOR = ":";

	constructor(content) {
		this.content = content;
		this.managers = {};
	}

	// type if `get` (return string) or `file` (bundle writes to file, returns file url)
	static getAssetKey(type, name, bucket) {
		if(Array.isArray(bucket)) {
			bucket = bucket.join(",");
		} else if(typeof bucket === "string") {
		} else {
			bucket = "";
		}
		return `/*__EleventyBundle:${type}:${name}:${bucket || "default"}:EleventyBundle__*/`
	}

	static parseAssetKey(str) {
		if(str.startsWith("/*__EleventyBundle:")) {
			let [prefix, type, name, bucket, suffix] = str.split(OutOfOrderRender.SEPARATOR);
			return { type, name, bucket };
		}
		return false;
	}

	setAssetManager(name, assetManager) {
		this.managers[name] = assetManager;
	}

	setOutputDirectory(dir) {
		this.outputDirectory = dir;
	}

	normalizeMatch(match) {
		let ret = OutOfOrderRender.parseAssetKey(match)
		return ret || match;
	}

	findAll() {
		let matches = this.content.split(OutOfOrderRender.SPLIT_REGEX);
		let ret = [];
		for(let match of matches) {
			ret.push(this.normalizeMatch(match));
		}
		return ret;
	}

	setWriteToFileSystem(isWrite) {
		this.writeToFileSystem = isWrite;
	}

	getAllBucketsForPage(pageData) {
		let availableBucketsForPage = new Set();
		for(let name in this.managers) {
			for(let bucket of this.managers[name].getBucketsForPage(pageData)) {
				availableBucketsForPage.add(`${name}::${bucket}`);
			}
		}
		return availableBucketsForPage;
	}

	getManager(name) {
		if(!this.managers[name]) {
			throw new Error(`No asset manager found for ${name}. Known names: ${Object.keys(this.managers)}`);
		}
		return this.managers[name];
	}

	async replaceAll(pageData, stage = 0) {
		let matches = this.findAll();
		let availableBucketsForPage = this.getAllBucketsForPage(pageData);
		let usedBucketsOnPage = new Set();
		let bucketsOutputStringCount = {};
		let bucketsFileCount = {};

		for(let match of matches) {
			if(typeof match === "string") {
				continue;
			}

			// type is `file` or `get`
			let {type, name, bucket} = match;
			let key = `${name}::${bucket}`;
			if(!usedBucketsOnPage.has(key)) {
				usedBucketsOnPage.add(key);
			}

			if(type === "get") {
				if(!bucketsOutputStringCount[key]) {
					bucketsOutputStringCount[key] = 0;
				}
				bucketsOutputStringCount[key]++;
			} else if(type === "file") {
				if(!bucketsFileCount[key]) {
					bucketsFileCount[key] = 0;
				}
				bucketsFileCount[key]++;
			}
		}

		// Hoist code in non-default buckets that are output multiple times
		// Only hoist if 2+ `get` OR 1+ `get` and 1+ `file`
		for(let bucketInfo in bucketsOutputStringCount) {
			let stringOutputCount = bucketsOutputStringCount[bucketInfo];
			if(stringOutputCount > 1 || stringOutputCount === 1 && bucketsFileCount[bucketInfo] > 0) {
				let [name, bucketName] = bucketInfo.split("::");
				this.getManager(name).hoistBucket(pageData, bucketName);
			}
		}

		let content = await Promise.all(matches.map(match => {
			if(typeof match === "string") {
				return match;
			}

			let {type, name, bucket} = match;
			let manager = this.getManager(name);

			// Quit early if in stage 0, run delayed replacements if in stage 1+
			if(typeof manager.isDelayed === "function" && manager.isDelayed() && stage === 0) {
				return OutOfOrderRender.getAssetKey(type, name, bucket);
			}

			if(type === "get") {
				// returns promise
				return manager.getForPage(pageData, bucket);
			} else if(type === "file") {
				// returns promise
				return manager.writeBundle(pageData, bucket, {
					output: this.outputDirectory,
					write: this.writeToFileSystem,
				});
			}
			return "";
		}));

		for(let bucketInfo of availableBucketsForPage) {
			if(!usedBucketsOnPage.has(bucketInfo)) {
				let [name, bucketName] = bucketInfo.split("::");
				debug(`WARNING! \`${pageData.inputPath}\` has unbundled \`${name}\` assets (in the '${bucketName}' bucket) that were not written to or used on the page. You might want to add a call to \`getBundle('${name}', '${bucketName}')\` to your content! Learn more: https://github.com/11ty/eleventy-plugin-bundle#asset-bucketing`);
			}
		}

		return content.join("");
	}
}

export { OutOfOrderRender };
