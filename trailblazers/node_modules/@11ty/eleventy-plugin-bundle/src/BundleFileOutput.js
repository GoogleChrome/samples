import fs from "node:fs";
import path from "node:path";
import debugUtil from "debug";

import { createHash } from "@11ty/eleventy-utils";

const debug = debugUtil("Eleventy:Bundle");

const hashCache = {};
const directoryExistsCache = {};
const writingCache = new Set();

class BundleFileOutput {
	constructor(outputDirectory, bundleDirectory) {
		this.outputDirectory = outputDirectory;
		this.bundleDirectory = bundleDirectory || "";
		this.hashLength = 10;
		this.fileExtension = undefined;
	}

	setFileExtension(ext) {
		this.fileExtension = ext;
	}

	async getFilenameHash(content) {
		if(hashCache[content]) {
			return hashCache[content];
		}

		let base64hash = await createHash(content);
		let filenameHash = base64hash.substring(0, this.hashLength);
		hashCache[content] = filenameHash;
		return filenameHash;
	}

	getFilename(filename, extension) {
		return filename + (extension && !extension.startsWith(".") ? `.${extension}` : "");
	}

	modifyPathToUrl(dir, filename) {
		return "/" + path.join(dir, filename).split(path.sep).join("/");
	}

	async writeBundle(content, type, writeToFileSystem) {
		// do not write a bundle, do not return a file name is content is empty
		if(!content) {
			return;
		}

		let dir = path.join(this.outputDirectory, this.bundleDirectory);
		let filenameHash = await this.getFilenameHash(content);
		let filename = this.getFilename(filenameHash, this.fileExtension || type);

		if(writeToFileSystem) {
			let fullPath = path.join(dir, filename);

			// no duplicate writes, this may be improved with a fs exists check, but it would only save the first write
			if(!writingCache.has(fullPath)) {
				writingCache.add(fullPath);

				if(!directoryExistsCache[dir]) {
					fs.mkdirSync(dir, { recursive: true });
					directoryExistsCache[dir] = true;
				}

				debug("Writing bundle %o", fullPath);
				fs.writeFileSync(fullPath, content);
			}
		}

		return this.modifyPathToUrl(this.bundleDirectory, filename);
	}
}

export { BundleFileOutput };
