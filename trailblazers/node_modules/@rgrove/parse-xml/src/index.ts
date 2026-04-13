import { Parser } from './lib/Parser.js';

import type { ParserOptions } from './lib/Parser.js';

export * from './lib/types.js';
export { XmlCdata } from './lib/XmlCdata.js';
export { XmlComment } from './lib/XmlComment.js';
export { XmlDeclaration } from './lib/XmlDeclaration.js';
export { XmlDocument } from './lib/XmlDocument.js';
export { XmlDocumentType } from './lib/XmlDocumentType.js';
export { XmlElement } from './lib/XmlElement.js';
export { XmlError } from './lib/XmlError.js';
export { XmlNode } from './lib/XmlNode.js';
export { XmlProcessingInstruction } from './lib/XmlProcessingInstruction.js';
export { XmlText } from './lib/XmlText.js';

export type { ParserOptions } from './lib/Parser.js';

/**
 * Parses the given XML string and returns an `XmlDocument` instance
 * representing the document tree.
 *
 * @example
 *
 * import { parseXml } from '@rgrove/parse-xml';
 * let doc = parseXml('<kittens fuzzy="yes">I like fuzzy kittens.</kittens>');
 *
 * @param xml XML string to parse.
 * @param options Parser options.
 */
export function parseXml(xml: string, options?: ParserOptions) {
  return (new Parser(xml, options)).document;
}
