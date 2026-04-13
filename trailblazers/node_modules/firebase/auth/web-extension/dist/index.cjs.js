'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var webExtension = require('@firebase/auth/web-extension');



Object.keys(webExtension).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return webExtension[k]; }
	});
});
//# sourceMappingURL=index.cjs.js.map
