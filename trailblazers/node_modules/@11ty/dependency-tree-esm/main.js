const path = require("node:path");
const { readFileSync, existsSync } = require("node:fs");

const acorn = require("acorn");
const normalizePath = require("normalize-path");
const { TemplatePath } = require("@11ty/eleventy-utils");
const { DepGraph } = require("dependency-graph");

// Is *not* a bare specifier (e.g. 'some-package')
// https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#terminology
function isNonBareSpecifier(importSource) {
	// Change \\ to / on Windows
	let normalized = normalizePath(importSource);
	// Relative specifier (e.g. './startup.js')
	if(normalized.startsWith("./") || normalized.startsWith("../")) {
		return true;
	}
	// Absolute specifier (e.g. 'file:///opt/nodejs/config.js')
	if(normalized.startsWith("file:")) {
		return true;
	}

	return false;
}

function normalizeFilePath(filePath) {
	return TemplatePath.standardizeFilePath(path.relative(".", filePath));
}

function normalizeImportSourceToFilePath(filePath, source) {
	let { dir } = path.parse(filePath);
	let normalized = path.join(dir, source);
	return normalizeFilePath(normalized);
}

function getImportAttributeType(attributes = []) {
	for(let node of attributes) {
		if(node.type === "ImportAttribute" && node.key.type === "Identifier" && node.key.name === "type") {
			return node.value.value;
		}
	}
}

async function getSources(filePath, contents, options = {}) {
	let { parserOverride } = Object.assign({}, options);
	let sources = new Set();
	let sourcesToRecurse = new Set();

	let ast = (parserOverride || acorn).parse(contents, {
		sourceType: "module",
		ecmaVersion: "latest",
	});

	for(let node of ast.body) {
		if(node.type === "ImportDeclaration" && isNonBareSpecifier(node.source.value)) {
			let importAttributeType = getImportAttributeType(node?.attributes);
			let normalized = normalizeImportSourceToFilePath(filePath, node.source.value);
			if(normalized !== filePath) {
				sources.add(normalized);

				// Recurse typeless (JavaScript) import types only
				// Right now only `css` and `json` are valid but others might come later
				if(!importAttributeType) {
					sourcesToRecurse.add(normalized);
				}
			}
		}
	}

	
	return {
		sources,
		sourcesToRecurse,
	}
}

// second argument used to be `alreadyParsedSet = new Set()`, keep that backwards compat
async function find(filePath, options = {}) {
	if(options instanceof Set) {
		options = {
			alreadyParsedSet: options
		};
	}

	if(!options.alreadyParsedSet) {
		options.alreadyParsedSet = new Set();
	}

	// TODO add a cache here
	// Unfortunately we need to read the entire file, imports need to be at the top level but they can be anywhere 🫠
	let normalized = normalizeFilePath(filePath);
	if(options.alreadyParsedSet.has(normalized) || !existsSync(filePath)) {
		return [];
	}
	options.alreadyParsedSet.add(normalized);

	let contents = readFileSync(normalized, { encoding: 'utf8' });
	let { sources, sourcesToRecurse } = await getSources(filePath, contents, options);

	// Recurse for nested deps
	for(let source of sourcesToRecurse) {
		let s = await find(source, options);
		for(let p of s) {
			if(sources.has(p) || p === filePath) {
				continue;
			}

			sources.add(p);
		}
	}

	return Array.from(sources);
}

function mergeGraphs(rootGraph, ...graphs) {
	if(!(rootGraph instanceof DepGraph)) {
		throw new Error("Incorrect type passed to mergeGraphs, expected DepGraph");
	}
	for(let g of graphs) {
		for(let node of g.overallOrder()) {
			if(!rootGraph.hasNode(node)) {
				rootGraph.addNode(node);
			}
			for(let dep of g.directDependenciesOf(node)) {
				rootGraph.addDependency(node, dep);
			}
		}
	}
}

// second argument used to be `alreadyParsedSet = new Set()`, keep that backwards compat
async function findGraph(filePath, options = {}) {
	if(options instanceof Set) {
		options = {
			alreadyParsedSet: options
		};
	}
	if(!options.alreadyParsedSet) {
		options.alreadyParsedSet = new Set();
	}

	let graph = new DepGraph();
	let normalized = normalizeFilePath(filePath);
	graph.addNode(filePath);

	if(options.alreadyParsedSet.has(normalized) || !existsSync(filePath)) {
		return graph;
	}
	options.alreadyParsedSet.add(normalized);

	let contents = readFileSync(normalized, "utf8");
	let { sources, sourcesToRecurse } = await getSources(filePath, contents, options);
	for(let source of sources) {
		if(!graph.hasNode(source)) {
			graph.addNode(source);
		}
		graph.addDependency(normalized, source);
	}

	// Recurse for nested deps
	for(let source of sourcesToRecurse) {
		let recursedGraph = await findGraph(source, options);
		mergeGraphs(graph, recursedGraph);
	}

	return graph;
}

module.exports = {
	find,
	findGraph,
	mergeGraphs,
};