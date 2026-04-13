import vm from "vm";
import * as acorn from "acorn";
import * as walk from "acorn-walk";
import { ImportTransformer } from "esm-import-transformer";
import { createRequire, Module } from "module";

import { getWorkingDirectory } from "./util/getWorkingDirectory.js";
import { isSupported } from "./util/vmModules.js";

const IS_VM_MODULES_SUPPORTED = isSupported();

// `import` and `require` should both be relative to working directory (not this file)
const WORKING_DIRECTORY = getWorkingDirectory();

// TODO (feature) option to change `require` home base
const customRequire = createRequire(WORKING_DIRECTORY);

class RetrieveGlobals {
	constructor(code, options) {
		this.originalCode = code;

		// backwards compat
		if(typeof options === "string") {
			options = {
				filePath: options
			};
		}

		this.options = Object.assign({
			filePath: null,
			transformEsmImports: false,
		}, options);

		if(IS_VM_MODULES_SUPPORTED) {
			// Override: no code transformations if vm.Module works
			this.options.transformEsmImports = false;
		}

		// set defaults
		let acornOptions = {};
		if(IS_VM_MODULES_SUPPORTED || this.options.transformEsmImports) {
			acornOptions.sourceType = "module";
		}

		this.setAcornOptions(acornOptions);
		this.setCreateContextOptions();

		// transform `import ___ from ___` to `const ___ = await import(___)` to emulate *some* import syntax.
		// Doesn’t currently work with aliases (mod as name) or namespaced imports (* as name).
		if(this.options.transformEsmImports) {
			this.code = this.transformer.transformToDynamicImport();
		} else {
			this.code = this.originalCode;
		}
	}

	get transformer() {
		if(!this._transformer) {
			this._transformer =  new ImportTransformer(this.originalCode);
		}
		return this._transformer;
	}

	setAcornOptions(acornOptions) {
		this.acornOptions = Object.assign({
			ecmaVersion: "latest",
		}, acornOptions );
	}

	setCreateContextOptions(contextOptions) {
		this.createContextOptions = Object.assign({
			codeGeneration: {
				strings: false,
				wasm: false,
			}
		}, contextOptions );
	}

	static _getProxiedContext(context = {}, options = {}) {
		return new Proxy(context, {
			get(target, propertyName) {
				if(Reflect.has(target, propertyName)) {
					return Reflect.get(target, propertyName);
				}

				if(options.reuseGlobal && Reflect.has(global, propertyName)) {
					return global[propertyName];
				}
				if(options.addRequire && propertyName === "require") {
					return customRequire;
				}
			}
		});
	}

	// We prune function and variable declarations that aren’t globally declared
	// (our acorn walker could be improved to skip non-global declarations, but this method is easier for now)
	static _getGlobalVariablesReturnString(names, mode = "cjs") {
		let s = [`let __globals = {};`];
		for(let name of names) {
			s.push(`if( typeof ${name} !== "undefined") { __globals.${name} = ${name}; }`);
		}
		return `${s.join("\n")};${mode === "esm" ? "\nexport default __globals;" : "return __globals;"}`
	}

	_setContextPrototype(context) {
		// Context will fail isPlainObject and won’t be merged in the data cascade properly without this prototype set
		// See https://github.com/11ty/eleventy-utils/blob/main/src/IsPlainObject.js
		if(!context || typeof context !== "object" || Array.isArray(context)) {
			return;
		}
		if(context instanceof Date) {
			return;
		}

		if(!Object.getPrototypeOf(context).isPrototypeOf(Object.create({}))) {
			Object.setPrototypeOf(context, Object.prototype);
			// Go deep
			for(let key in context) {
				this._setContextPrototype(context[key]);
			}
		}
	}

	_getCode(code, options) {
		let { async: isAsync, globalNames, experimentalModuleApi, data } = Object.assign({
			async: true
		}, options);

		if(IS_VM_MODULES_SUPPORTED) {
			return `${code}

${globalNames ? RetrieveGlobals._getGlobalVariablesReturnString(globalNames, "esm") : ""}`;
		}

		let prefix = [];
		let argKeys = "";
		let argValues = "";

		// Don’t use this when vm.Module is stable (or if the code doesn’t have any imports!)
		if(experimentalModuleApi) {
			prefix = "module.exports = ";

			if(typeof data === "object") {
				let dataKeys = Object.keys(data);
				if(dataKeys) {
					argKeys = `{${dataKeys.join(",")}}`;
					argValues = JSON.stringify(data, function replacer(key, value) {
						if(typeof value === "function") {
							throw new Error(`When using \`experimentalModuleApi\`, context data must be JSON.stringify friendly. The "${key}" property was type \`function\`.`);
						}
						return value;
					});
				}
			}
		}

		return `${prefix}(${isAsync ? "async " : ""}function(${argKeys}) {
	${code}
	${globalNames ? RetrieveGlobals._getGlobalVariablesReturnString(globalNames, "cjs") : ""}
})(${argValues});`;
	}

	getGlobalNames(parsedAst) {
		let globalNames = new Set();

		let types = {
			FunctionDeclaration(node) {
				globalNames.add(node.id.name);
			},
			VariableDeclarator(node) {
				// destructuring assignment Array
				if(node.id.type === "ArrayPattern") {
					for(let prop of node.id.elements) {
						if(prop.type === "Identifier") {
							globalNames.add(prop.name);
						}
					}
				} else if(node.id.type === "ObjectPattern") {
					// destructuring assignment Object
					for(let prop of node.id.properties) {
						if(prop.type === "Property") {
							globalNames.add(prop.value.name);
						}
					}
				} else if(node.id.name) {
					globalNames.add(node.id.name);
				}
			},
			// if imports aren’t being transformed to variables assignment, we need those too
			ImportSpecifier(node) {
				globalNames.add(node.imported.name);
			}
		};

		walk.simple(parsedAst, types);

		return globalNames;
	}

	_getParseError(code, err) {
		// Acorn parsing error on script
		let metadata = [];
		if(this.options.filePath) {
			metadata.push(`file: ${this.options.filePath}`);
		}
		if(err?.loc?.line) {
			metadata.push(`line: ${err.loc.line}`);
		}
		if(err?.loc?.column) {
			metadata.push(`column: ${err.loc.column}`);
		}

		return new Error(`Had trouble parsing with "acorn"${metadata.length ? ` (${metadata.join(", ")})` : ""}:
Message: ${err.message}

${code}`);
	}

	async _getGlobalContext(data, options) {
		let {
			async: isAsync,
			reuseGlobal,
			dynamicImport,
			addRequire,
			experimentalModuleApi,
		} = Object.assign({
			// defaults
			async: true,

			reuseGlobal: false,

			// adds support for `require`
			addRequire: false,

			// allows dynamic import in `vm` (requires --experimental-vm-modules in Node v20.10+)
			// https://github.com/nodejs/node/issues/51154
			// TODO Another workaround possibility: We could use `import` outside of `vm` and inject the dependencies into context `data`
			dynamicImport: false,

			// Use Module._compile instead of vm
			// Workaround for: https://github.com/zachleat/node-retrieve-globals/issues/2
			// Warning: This method requires input `data` to be JSON stringify friendly.
			// Don’t use this if vm.Module is supported
			// Don’t use this if the code does not contain `import`s
			experimentalModuleApi: !IS_VM_MODULES_SUPPORTED && this.transformer.hasImports(),
		}, options);

		if(IS_VM_MODULES_SUPPORTED) {
			// Override: don’t use this when modules are allowed.
			experimentalModuleApi = false;
		}

		// These options are already supported by Module._compile
		if(experimentalModuleApi) {
			addRequire = false;
			dynamicImport = false;
		}

		if(reuseGlobal || addRequire) {
			// Re-use the parent `global` https://nodejs.org/api/globals.html
			data = RetrieveGlobals._getProxiedContext(data || {}, {
				reuseGlobal,
				addRequire,
			});
		}

		if(!data) {
			data = {};
		}

		let context;
		if(experimentalModuleApi || vm.isContext(data)) {
			context = data;
		} else {
			context = vm.createContext(data, this.createContextOptions);
		}

		let parseCode;
		let globalNames;

		try {
			parseCode = this._getCode(this.code, {
				async: isAsync,
			});

			let parsedAst = acorn.parse(parseCode, this.acornOptions);
			globalNames = this.getGlobalNames(parsedAst);
		} catch(e) {
			throw this._getParseError(parseCode, e);
		}

		try {
			let execCode = this._getCode(this.code, {
				async: isAsync,
				globalNames,
				experimentalModuleApi,
				data: context,
			});

			if(experimentalModuleApi) {
				let m = new Module();
				m._compile(execCode, WORKING_DIRECTORY);
				return m.exports;
			}

			let execOptions = {};
			if(dynamicImport) {
				// Warning: this option is part of the experimental modules API
				execOptions.importModuleDynamically = (specifier) => import(specifier);
			}

			if(IS_VM_MODULES_SUPPORTED) {
				// options.initializeImportMeta
				let m = new vm.SourceTextModule(execCode, {
					context,
					initializeImportMeta: (meta, module) => {
						meta.url = this.options.filePath || WORKING_DIRECTORY || module.identifier;
					},
					...execOptions,
				});

				// Thank you! https://stackoverflow.com/a/73282303/16711
				await m.link(async (specifier, referencingModule) => {
					const mod = await import(specifier);
					const exportNames = Object.keys(mod);
					return new vm.SyntheticModule(
						exportNames,
						function () {
							exportNames.forEach(key => {
								this.setExport(key, mod[key])
							});
						},
						{
							identifier: specifier,
							context: referencingModule.context
						}
					);
				});

				await m.evaluate();

				// TODO (feature) incorporate other esm `exports` here
				return m.namespace.default;
			}

			return vm.runInContext(execCode, context, execOptions);
		} catch(e) {
			let type = "cjs";
			if(IS_VM_MODULES_SUPPORTED) {
				type = "esm";
			} else if(experimentalModuleApi) {
				type = "cjs-experimental";
			}

			throw new Error(`Had trouble executing Node script (type: ${type}):
Message: ${e.message}

${this.code}`);
		}
	}

	async getGlobalContext(data, options) {
		let ret = await this._getGlobalContext(data, Object.assign({
			// whether or not the target code is executed asynchronously
			// note that vm.Module will always be async-friendly
			async: true,
		}, options));

		this._setContextPrototype(ret);

		return ret;
	}
}

export { RetrieveGlobals };
