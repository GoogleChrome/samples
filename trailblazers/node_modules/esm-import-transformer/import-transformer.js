import { parse } from "acorn";

const COMMENT_START = "/* ";
const COMMENT_END = " */";
const EXPORT_STR = "export ";

export class ImportTransformer {
  constructor(input, ast) {
    this.parse(input, ast);
  }

  parse(input, ast) {
    if(!input) {
      throw new Error("Missing input to ImportTransformer, received: " + input)
    }

    this.originalSource = input;

    if(ast) {
      this.ast = ast;
    } else {
      this.ast = parse(input, {
        sourceType: "module",
        ecmaVersion: "latest"
      });
    }

    this.imports = new Set();
    this.exports = new Set();
    this.namedExports = new Set();
  }

  static commentNode(str, sourceNode, indexOffset = 0) {
    let { start, end } = sourceNode;
    let statement = str.slice(start + indexOffset, end + indexOffset);
    return {
      statement,
      code: `${str.slice(0, start + indexOffset)}${COMMENT_START}${statement}${COMMENT_END}${str.slice(end + indexOffset)}`,
      offset: COMMENT_START.length + COMMENT_END.length,
    };
  }

  static commentExportDeclarationOnly(str, sourceNode, indexOffset = 0) {
    let { start, end } = sourceNode;
    let statement = str.slice(start + indexOffset, end + indexOffset);

    let functionDeclarationName = sourceNode.declaration?.id?.name;
    let variableIdentifierNames = (sourceNode.declaration?.declarations || []).map(node => {
      if(node.id.properties) {
        return node.id.properties.map(node => node.key.name)
      } else if(node.id.name) {
        return node.id.name;
      }

      throw new Error("Could not find variable identifier in declaration for: " + statement);
    }).flat();

    let reuseStatement;
    // change `export const a = 1;` to `export { a };` for reuse
    if(functionDeclarationName || variableIdentifierNames.length > 0) {
      reuseStatement = `export { ${functionDeclarationName || variableIdentifierNames.join(", ") } };`;
    } else {
      throw new Error("Couldn’t find identifier name for: " + statement);
    }

    // -1 there removes the double space between `export ` and ` */`
    let commented = `${COMMENT_START}${EXPORT_STR.slice(0, -1)}${COMMENT_END}${statement.slice(EXPORT_STR.length)}`
    return {
      statement: reuseStatement,
      namedExports: functionDeclarationName ? [functionDeclarationName] : variableIdentifierNames,
      code: `${str.slice(0, start + indexOffset)}${commented}${str.slice(end + indexOffset)}`,
      offset: COMMENT_START.length + COMMENT_END.length - 1, // -1 removes the double space between `export ` and ` */`
    };
  }

  static transformImportSource(str, sourceNode, indexOffset = 0, importMap = {}) {
    let { start, end, value } = sourceNode;
    // Could be improved by https://www.npmjs.com/package/@import-maps/resolve
    let resolved = importMap?.imports && importMap?.imports[value];
    if(resolved) {
      return {
        code: `${str.slice(0, start + 1 + indexOffset)}${resolved}${str.slice(end - 1 + indexOffset)}`,
        offset: resolved.length - value.length,
      };
    }
    return {
      code: str,
      offset: 0
    };
  }

  static transformImportCode(prefix, str, node, specifiers, sourceNode, indexOffset = 0) {
    let { start, end } = node;
    let endOffset = end - sourceNode.end;

    start += indexOffset;
    end += indexOffset;

    let { raw: rawSourceValue } = sourceNode;
    let importDeclaration = str.slice(start, end);

    let specifierIndexes = [];
    if(importDeclaration.startsWith("import * as ")) {
      specifierIndexes[0] = "import * as ".length + start;
    } else if(importDeclaration.startsWith("import ")) {
      specifierIndexes[0] = "import ".length + start;
    } else {
      throw new Error(`Could not find \`import\` in import declaration: ${importDeclaration}`);
    }

    specifierIndexes[1] = specifiers[specifiers.length - 1].end + indexOffset;

    // normalize away trailing } on import { a, b, c } specifiers
    let split = str.slice(specifierIndexes[1]).split(" from ");
    if(split.length > 0) {
      specifierIndexes[1] += split[0].length;
    }

    let newImportString = `const ${str.slice(specifierIndexes[0], specifierIndexes[1])} = ${prefix}(${rawSourceValue})`;
    let returnedCode = str.slice(0, start) + newImportString + str.slice(end - endOffset);

    return {
      code: returnedCode,
      offset: returnedCode.length - str.length,
    };
  }

  _transform(prefix) {
    let input = this.originalSource;
    let indexOffset = 0;
    for(let node of this.ast.body) {
      if(node.type === "ImportDeclaration") {
        let ret = ImportTransformer.transformImportCode(prefix, input, node, node.specifiers, node.source, indexOffset)
        input = ret.code;
        indexOffset += ret.offset;
      }
    }

    return input;
  }

  transformToDynamicImport() {
    return this._transform("await import");
  }

  transformToRequire() {
    return this._transform("require");
  }

  // alias for backwards compat
  transform(...args) {
    return this.transformWithImportMap(...args);
  }

  transformRemoveImportExports() {
    let input = this.originalSource;
    let indexOffset = 0;
    for(let node of this.ast.body) {
      if(node.type === "ImportDeclaration") {
        let ret = ImportTransformer.commentNode(input, node, indexOffset);
        input = ret.code;
        indexOffset += ret.offset;
        this.imports.add(ret.statement);
      } else if(node.type?.startsWith("Export")) {
        let ret;
        // comment out `export { name }` and `export default`
        if(node.type === "ExportNamedDeclaration" && node.specifiers.length > 0 || node.type === "ExportDefaultDeclaration") {
          ret = ImportTransformer.commentNode(input, node, indexOffset);
          if(node.type === "ExportDefaultDeclaration") {
            this.namedExports.add("default");
          } else {
            for(let specifierNode of node.specifiers || []) {
              if(specifierNode?.exported?.name) {
                this.namedExports.add(specifierNode.exported.name);
              }
            }
          }
        } else {
          // just comment out start `export ` from the beginning of `export const` or `export function`
          ret = ImportTransformer.commentExportDeclarationOnly(input, node, indexOffset);
          for(let name of ret.namedExports) {
            this.namedExports.add(name);
          }
        }

        input = ret.code;
        indexOffset += ret.offset;
        this.exports.add(ret.statement);
      }
    }

    return input;
  }

  getImportsAndExports() {
    return {
      imports: this.imports,
      exports: this.exports,
      namedExports: this.namedExports,
    };
  }

  transformWithImportMap(importMap) {
    if(!importMap) {
      return this.originalSource;
    }

    let input = this.originalSource;
    let indexOffset = 0;
    for(let node of this.ast.body) {
      if(node.type === "ImportDeclaration") {
        if(importMap?.imports) {
          let ret = ImportTransformer.transformImportSource(input, node.source, indexOffset, importMap);
          input = ret.code;
          indexOffset += ret.offset;
        }
      }
    }

    return input;
  }

  hasImports() {
    for(let node of this.ast.body) {
      if(node.type === "ImportDeclaration") {
        return true;
      }
    }

    return false;
  }
}
