function base64UrlSafe(hashString = "") {
	return hashString.replace(/[=\+\/]/g, function(match) {
		if(match === "=") {
			return "";
		}
		if(match === "+") {
			return "-";
		}
		return "_";
	});
}

module.exports = { base64UrlSafe };