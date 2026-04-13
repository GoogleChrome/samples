
const { Hash } = require("./HashTypes.js");

// same output as node:crypto above (though now async).
async function createHash(...content) {
	return Hash.create().toBase64Url(...content);
}

async function createHashHex(...content) {
	return Hash.create().toHex(...content);
}

// Slower, but this feature does not require WebCrypto
function createHashSync(...content) {
	return Hash.createSync().toBase64Url(...content);
}

function createHashHexSync(...content) {
	return Hash.createSync().toHex(...content);
}

module.exports = {
	createHash,
	createHashSync,
	createHashHex,
	createHashHexSync,
};