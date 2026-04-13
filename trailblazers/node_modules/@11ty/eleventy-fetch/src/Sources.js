class Sources {
	static isFullUrl(url) {
		try {
			if(url instanceof URL) {
				return true;
			}

			new URL(url);
			return true;
		} catch (e) {
			// invalid url OR already a local path
			return false;
		}
	}

	static isValidSource(source) {
		// String (url?)
		if(typeof source === "string") {
			return true;
		}
		if(this.isValidComplexSource(source)) {
			return true;
		}
		return false;
	}

	static isValidComplexSource(source) {
		// Async/sync Function
		if(typeof source === "function") {
			return true;
		}
		if(typeof source === "object") {
			// Raw promise
			if(typeof source.then === "function") {
				return true;
			}
			// anything string-able
			if(typeof source.toString === "function") {
				return true;
			}
		}
		return false;
	}

	static getInvalidSourceError(source, errorCause) {
		return new Error("Invalid source: must be a string, function, or Promise. If a function or Promise, you must provide a `toString()` method or an `options.requestId` unique key. Received: " + source, { cause: errorCause });
	}
}

module.exports = Sources;
