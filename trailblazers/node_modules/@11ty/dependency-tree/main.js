const path = require("node:path");
const { TemplatePath } = require("@11ty/eleventy-utils");

function getAbsolutePath(filename) {
  let normalizedFilename = path.normalize(filename); // removes dot slash
  let hasDotSlash = filename.startsWith("./");
  return hasDotSlash ? path.join(path.resolve("."), normalizedFilename) : normalizedFilename;
}

function getRelativePath(filename) {
  let normalizedFilename = path.normalize(filename); // removes dot slash
  let workingDirectory = path.resolve(".");
  let result = "./" + (normalizedFilename.startsWith(workingDirectory) ? normalizedFilename.substr(workingDirectory.length + 1) : normalizedFilename);
  return result;
}

function getNodeModuleName(filename) {
  let foundNodeModules = false;
  let moduleName = [];

  let s = filename.split(path.sep);
  for(let entry of s) {
    if(entry === '.pnpm') {
      foundNodeModules = false;
    }

    if(foundNodeModules) {
      moduleName.push(entry);
      if(!entry.startsWith("@")) {
        return moduleName.join("/");
      }
    }

    if(entry === "node_modules") {
      foundNodeModules = true;
    }
  }

  return false;
}

/* unordered */
function getDependenciesFor(filename, avoidCircular, optionsArg = {}) {
  // backwards compatibility with `nodeModuleNamesOnly` boolean option
  // Using `nodeModuleNames` property moving forward
  if(("nodeModuleNamesOnly" in optionsArg) && !("nodeModuleNames" in optionsArg)) {
    if(optionsArg.nodeModuleNamesOnly === true) {
      optionsArg.nodeModuleNames = "only";
    }
    if(optionsArg.nodeModuleNamesOnly === false) {
      optionsArg.nodeModuleNames = "exclude";
    }
  }

  let options = Object.assign({
    allowNotFound: false,
    nodeModuleNames: "exclude", // also "include" or "only"
  }, optionsArg);
  let absoluteFilename = getAbsolutePath(filename);
  let modules = new Set();

  try {
    let res = require(absoluteFilename);
    if(res[Symbol.toStringTag] === "Module" || res.__esModule) {
      modules.add(filename);
    }
  } catch(e) {
    if(e.code === "MODULE_NOT_FOUND" && options.allowNotFound) {
      // do nothing
    } else {
      throw e;
    }
  }


  let mod;
  for(let entry in require.cache) {
    if(entry === absoluteFilename) {
      mod = require.cache[entry];
      break;
    }
  }

  let dependencies = new Set();

  if(!mod) {
    if(!options.allowNotFound) {
      throw new Error(`Could not find ${filename} in @11ty/dependency-tree`);
    }
  } else {
    let relativeFilename = getRelativePath(mod.filename);
    if(!avoidCircular) {
      avoidCircular = {};
    } else if(options.nodeModuleNames !== "only") {
      dependencies.add(relativeFilename);
    }

    avoidCircular[relativeFilename] = true;

    if(Array.isArray(mod.children) && mod.children.length > 0) {
      for(let child of mod.children) {
        let relativeChildFilename = getRelativePath(child.filename);
        let nodeModuleName = getNodeModuleName(child.filename);

        if(options.nodeModuleNames !== "exclude" && nodeModuleName) {
          dependencies.add(nodeModuleName);
        }
        // Add dependencies of this dependency (not top level node_modules)
        if(nodeModuleName === false) {
          if(!dependencies.has(relativeChildFilename) && // avoid infinite looping with circular deps
            !avoidCircular[relativeChildFilename] ) {
            let { commonjs, esm } = getDependenciesFor(relativeChildFilename, avoidCircular, options);
            for(let dependency of commonjs) {
              dependencies.add(dependency);
            }
            for(let dependency of esm) {
              modules.add(dependency);
            }
          }
        }
      }
    }
  }

  return {
    esm: modules,
    commonjs: dependencies,
  }
}

function normalizeList(packageSet) {
  return Array.from( packageSet ).map(filePath => {
    if(filePath.startsWith("./")) {
      return TemplatePath.standardizeFilePath(filePath);
    }
    return filePath; // node_module name
  })
}

function getCleanDependencyListFor(filename, options = {}) {
  let { commonjs } = getDependenciesFor(filename, null, options);

  return normalizeList(commonjs);
}

function getCleanDependencyListByTypeFor(filename, options = {}) {
  let { commonjs, esm } = getDependenciesFor(filename, null, options);

  return {
    commonjs: normalizeList(commonjs),
    esm: normalizeList(esm),
  };
}

module.exports = getCleanDependencyListFor;
module.exports.getPackagesByType = getCleanDependencyListByTypeFor;
module.exports.getNodeModuleName = getNodeModuleName;