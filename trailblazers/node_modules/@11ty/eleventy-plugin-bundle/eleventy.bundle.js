import bundleManagersPlugin from "./src/eleventy.bundleManagers.js";
import pruneEmptyBundlesPlugin from "./src/eleventy.pruneEmptyBundles.js";
import globalShortcodesAndTransforms from "./src/eleventy.shortcodes.js";
import debugUtil from "debug";

const debug = debugUtil("Eleventy:Bundle");

function normalizeOptions(options = {}) {
	options = Object.assign({
		// Plugin defaults

		// Extra bundles
		// css, js, and html are guaranteed unless `bundles: false`
		bundles: [],
		toFileDirectory: "bundle",
		// post-process
		transforms: [],
		hoistDuplicateBundlesFor: [],
		bundleExportKey: "bundle", // use a `bundle` export in a 11ty.js template to populate bundles

		force: false, // force overwrite of existing getBundleManagers and addBundle configuration API methods
	}, options);

	if(options.bundles !== false) {
		options.bundles = Array.from(new Set(["css", "js", "html", ...(options.bundles || [])]));
	}

	return options;
}

function eleventyBundlePlugin(eleventyConfig, pluginOptions = {}) {
	eleventyConfig.versionCheck(">=3.0.0");
	pluginOptions = normalizeOptions(pluginOptions);

	let alreadyAdded = "getBundleManagers" in eleventyConfig || "addBundle" in eleventyConfig;
	if(!alreadyAdded || pluginOptions.force) {
		if(alreadyAdded && pluginOptions.force) {
			debug("Bundle plugin already added via `addPlugin`, add was forced via `force: true`");
		}

		bundleManagersPlugin(eleventyConfig, pluginOptions);
	}

	// These can’t be unique (don’t skip re-add above), when the configuration file resets they need to be added again
	pruneEmptyBundlesPlugin(eleventyConfig, pluginOptions);
	globalShortcodesAndTransforms(eleventyConfig, pluginOptions);

	// Support subsequent calls like addPlugin(BundlePlugin, { bundles: [] });
	if(Array.isArray(pluginOptions.bundles)) {
		debug("Adding bundles via `addPlugin`: %o", pluginOptions.bundles)
		pluginOptions.bundles.forEach(name => {
			let isHoisting = Array.isArray(pluginOptions.hoistDuplicateBundlesFor) && pluginOptions.hoistDuplicateBundlesFor.includes(name);

			eleventyConfig.addBundle(name, {
				hoist: isHoisting,
				outputFileExtension: name, // default as `name`
				shortcodeName: name, // `false` will skip shortcode
				transforms: pluginOptions.transforms,
				toFileDirectory: pluginOptions.toFileDirectory,
				bundleExportKey: pluginOptions.bundleExportKey, // `false` will skip bundle export
			});
		});
	}
};

// This is used to find the package name for this plugin (used in eleventy-plugin-webc to prevent dupes)
Object.defineProperty(eleventyBundlePlugin, "eleventyPackage", {
	value: "@11ty/eleventy-plugin-bundle"
});

export default eleventyBundlePlugin;
export { normalizeOptions };
