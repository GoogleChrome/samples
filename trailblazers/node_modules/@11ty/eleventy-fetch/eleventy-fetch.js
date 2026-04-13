const { default: PQueue } = require("p-queue");
const debug = require("debug")("Eleventy:Fetch");

const Sources = require("./src/Sources.js");
const RemoteAssetCache = require("./src/RemoteAssetCache.js");
const AssetCache = require("./src/AssetCache.js");
const DirectoryManager = require("./src/DirectoryManager.js");

const globalOptions = {
	type: "buffer",
	directory: ".cache",
	concurrency: 10,
	fetchOptions: {},
	dryRun: false, // don’t write anything to the file system

	// *does* affect cache key hash
	removeUrlQueryParams: false,

	// runs after removeUrlQueryParams, does not affect cache key hash
	// formatUrlForDisplay: function(url) {
	// 	return url;
	// },

	verbose: false, // Changed in 3.0+

	hashLength: 30,
};

/* Queue */
let queue = new PQueue({
	concurrency: globalOptions.concurrency,
});

queue.on("active", () => {
	debug(`Concurrency: ${queue.concurrency}, Size: ${queue.size}, Pending: ${queue.pending}`);
});

let instCache = {};

let directoryManager = new DirectoryManager();

function createRemoteAssetCache(source, rawOptions = {}) {
	if (!Sources.isFullUrl(source) && !Sources.isValidSource(source)) {
		return Promise.reject(new Error("Invalid source. Received: " + source));
	}

	let options = Object.assign({}, globalOptions, rawOptions);
	let sourceKey = RemoteAssetCache.getRequestId(source, options);
	if(!sourceKey) {
		return Promise.reject(Sources.getInvalidSourceError(source));
	}

	if(instCache[sourceKey]) {
		return instCache[sourceKey];
	}

	let inst = new RemoteAssetCache(source, options.directory, options);
	inst.setQueue(queue);
	inst.setDirectoryManager(directoryManager);

	instCache[sourceKey] = inst;

	return inst;
}

module.exports = function (source, options) {
	let instance = createRemoteAssetCache(source, options);
	return instance.queue();
};

Object.defineProperty(module.exports, "concurrency", {
	get: function () {
		return queue.concurrency;
	},
	set: function (concurrency) {
		queue.concurrency = concurrency;
	},
});

module.exports.Fetch = createRemoteAssetCache;

// Deprecated API kept for backwards compat, instead: use default export directly.
// Intentional: queueCallback is ignored here
module.exports.queue = function(source, queueCallback, options) {
	let instance = createRemoteAssetCache(source, options);
	return instance.queue();
};

module.exports.Util = {
	isFullUrl: Sources.isFullUrl,
};
module.exports.RemoteAssetCache = RemoteAssetCache;
module.exports.AssetCache = AssetCache;
module.exports.Sources = Sources;
