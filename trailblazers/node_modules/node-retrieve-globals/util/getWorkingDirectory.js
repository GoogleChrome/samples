import path from "node:path";
import { pathToFileURL } from "node:url";

function addTrailingSlash(path) {
	if(path.endsWith("/")) {
		return path;
	}
	return path + "/";
}


function getWorkingDirectory() {
	// Trailing slash required
	// `import` and `require` should both be relative to working directory (not this file)
	return addTrailingSlash(pathToFileURL(path.resolve(".")).toString());
}

export { getWorkingDirectory };