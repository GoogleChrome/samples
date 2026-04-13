import matchHelper from "posthtml-match-helper";
import debugUtil from "debug";

const debug = debugUtil("Eleventy:Bundle");

const ATTRS = {
	keep: "eleventy:keep"
};

const POSTHTML_PLUGIN_NAME = "11ty/eleventy-bundle/prune-empty";

function getTextNodeContent(node) {
	if (!node.content) {
		return "";
	}

	return node.content
		.map((entry) => {
			if (typeof entry === "string") {
				return entry;
			}
			if (Array.isArray(entry.content)) {
				return getTextNodeContent(entry);
			}
			return "";
		})
		.join("");
}

function eleventyPruneEmptyBundles(eleventyConfig, options = {}) {
	// Right now script[src],link[rel="stylesheet"] nodes are removed if the final bundles are empty.
	// `false` to disable
	options.pruneEmptySelector = options.pruneEmptySelector ?? `style,script,link[rel="stylesheet"]`;

	// Subsequent call can remove a previously added `addPosthtmlPlugin` entry
	// htmlTransformer.remove is v3.0.1-alpha.4+
	if(typeof eleventyConfig.htmlTransformer.remove === "function") {
		eleventyConfig.htmlTransformer.remove("html", entry => {
			if(entry.name === POSTHTML_PLUGIN_NAME) {
				return true;
			}

			// Temporary workaround for missing `name` property.
			let fnStr = entry.fn.toString();
			return !entry.name && fnStr.startsWith("function (pluginOptions = {}) {") && fnStr.includes(`tree.match(matchHelper(options.pruneEmptySelector), function (node)`);
		});
	}

	// `false` disables this plugin
	if(options.pruneEmptySelector === false) {
		return;
	}

	if(!eleventyConfig.htmlTransformer || !eleventyConfig.htmlTransformer?.constructor?.SUPPORTS_PLUGINS_ENABLED_CALLBACK) {
		debug("You will need to upgrade your version of Eleventy core to remove empty bundle tags automatically (v3 or newer).");
		return;
	}

	eleventyConfig.htmlTransformer.addPosthtmlPlugin(
		"html",
		function bundlePruneEmptyPosthtmlPlugin(pluginOptions = {}) {
			return function (tree) {
				tree.match(matchHelper(options.pruneEmptySelector), function (node) {
					if(node.attrs && node.attrs[ATTRS.keep] !== undefined) {
						delete node.attrs[ATTRS.keep];
						return node;
					}

					// <link rel="stylesheet" href="">
					if(node.tag === "link") {
						if(node.attrs?.rel === "stylesheet" && (node.attrs?.href || "").trim().length === 0) {
							return false;
						}
					} else {
						let content = getTextNodeContent(node);

						if(!content) {
							// <script></script> or <script src=""></script>
							if(node.tag === "script" && (node.attrs?.src || "").trim().length === 0) {
								return false;
							}

							// <style></style>
							if(node.tag === "style") {
								return false;
							}
						}
					}


					return node;
				});
			};
		},
		{
			name: POSTHTML_PLUGIN_NAME,
			// the `enabled` callback for plugins is available on v3.0.0-alpha.20+ and v3.0.0-beta.2+
			enabled: () => {
				return Object.keys(eleventyConfig.getBundleManagers()).length > 0;
			}
		}
	);
}

export default eleventyPruneEmptyBundles;
