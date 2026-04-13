var minimatch = require("minimatch");

// via https://github.com/sindresorhus/array-union (MIT license)
function arrayUnion(...args) {
	return [...new Set(args.flat())];
}

// via https://github.com/sindresorhus/array-differ/blob/main/index.js (MIT license)
function arrayDiffer(array, ...values) {
	const rest = new Set(values.flat());
	return array.filter(element => !rest.has(element));
}

// via https://github.com/sindresorhus/arrify/blob/main/index.js (MIT license)
function arrify(value) {
	if (value === null || value === undefined) {
		return [];
	}

	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === 'string') {
		return [value];
	}

	if (typeof value[Symbol.iterator] === 'function') {
		return [...value];
	}

	return [value];
}

// via https://www.npmjs.com/package/maximatch (MIT license)
module.exports = function (list, patterns, options) {
	list = arrify(list);

	patterns = arrify(patterns);

	if (list.length === 0 || patterns.length === 0) {
		return [];
	}

	options = options || {};

	return patterns.reduce(function (ret, pattern) {
		if (typeof pattern === "function") {
			return arrayUnion(ret, list.filter(pattern));
		} else if (pattern instanceof RegExp) {
			return arrayUnion(
				ret,
				list.filter(function (item) {
					return pattern.test(item);
				}),
			);
		} else {
			var process = arrayUnion;

			if (pattern[0] === "!") {
				pattern = pattern.slice(1);

				process = arrayDiffer;
			}

			return process(ret, minimatch.match(list, pattern, options));
		}
	}, []);
};
