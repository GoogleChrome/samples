function isBuffer(inst) {
	if(typeof Buffer !== "undefined") {
		return Buffer.isBuffer(inst);
	}
	return inst instanceof Uint8Array;
}

module.exports = {
	isBuffer
}