import { OutOfOrderRender } from "./OutOfOrderRender.js";
import debugUtil from "debug";

const debug = debugUtil("Eleventy:Bundle");

export default function(eleventyConfig, pluginOptions = {}) {
	let managers = eleventyConfig.getBundleManagers();
	let writeToFileSystem = true;

	function bundleTransform(content, stage = 0) {
		// Only run if content is string
		// Only run if managers are in play
		if(typeof content !== "string" || Object.keys(managers).length === 0) {
			return content;
		}

		debug("Processing %o", this.page.url);
		let render = new OutOfOrderRender(content);
		for(let key in managers) {
			render.setAssetManager(key, managers[key]);
		}

		render.setOutputDirectory(eleventyConfig.directories.output);
		render.setWriteToFileSystem(writeToFileSystem);

		return render.replaceAll(this.page, stage);
	}

	eleventyConfig.on("eleventy.before", async ({ outputMode }) => {
		if(Object.keys(managers).length === 0) {
			return;
		}

		if(outputMode !== "fs") {
			writeToFileSystem = false;
			debug("Skipping writing to the file system due to output mode: %o", outputMode);
		}
	});

	// e.g. `getBundle` shortcode to get code in current page bundle
	// bucket can be an array
	// This shortcode name is not configurable on purpose (for wider plugin compatibility)
	eleventyConfig.addShortcode("getBundle", function getContent(type, bucket, explicitUrl) {
		if(!type || !(type in managers) || Object.keys(managers).length === 0) {
			throw new Error(`Invalid bundle type: ${type}. Available options: ${Object.keys(managers)}`);
		}

		return OutOfOrderRender.getAssetKey("get", type, bucket);
	});

	// write a bundle to the file system
	// This shortcode name is not configurable on purpose (for wider plugin compatibility)
	eleventyConfig.addShortcode("getBundleFileUrl", function(type, bucket, explicitUrl) {
		if(!type || !(type in managers) || Object.keys(managers).length === 0) {
			throw new Error(`Invalid bundle type: ${type}. Available options: ${Object.keys(managers)}`);
		}

		return OutOfOrderRender.getAssetKey("file", type, bucket);
	});

	eleventyConfig.addTransform("@11ty/eleventy-bundle", function (content) {
		let hasNonDelayedManagers = Boolean(Object.values(eleventyConfig.getBundleManagers()).find(manager => {
			return typeof manager.isDelayed !== "function" || !manager.isDelayed();
		}));
		if(hasNonDelayedManagers) {
			return bundleTransform.call(this, content, 0);
		}
		return content;
	});

	eleventyConfig.addPlugin((eleventyConfig) => {
		// Delayed bundles *MUST* not alter URLs
		eleventyConfig.addTransform("@11ty/eleventy-bundle/delayed", function (content) {
			let hasDelayedManagers = Boolean(Object.values(eleventyConfig.getBundleManagers()).find(manager => {
				return typeof manager.isDelayed === "function" && manager.isDelayed();
			}));
			if(hasDelayedManagers) {
				return bundleTransform.call(this, content, 1);
			}
			return content;
		});
	});
};
