import { XmlNode } from './XmlNode.js';

/**
 * A document type declaration within an XML document.
 *
 * @example
 *
 * ```xml
 * <!DOCTYPE kittens [
 *   <!ELEMENT kittens (#PCDATA)>
 * ]>
 * ```
 */
export class XmlDocumentType extends XmlNode {
  /**
   * Name of the root element described by this document type declaration.
   */
  name: string;

  /**
   * Public identifier of the external subset of this document type declaration,
   * or `null` if no public identifier was present.
   */
  publicId: string | null;

  /**
   * System identifier of the external subset of this document type declaration,
   * or `null` if no system identifier was present.
   */
  systemId: string | null;

  /**
   * Internal subset of this document type declaration, or `null` if no internal
   * subset was present.
   */
  internalSubset: string | null;

  constructor(
    name: string,
    publicId?: string,
    systemId?: string,
    internalSubset?: string,
  ) {
    super();
    this.name = name;
    this.publicId = publicId ?? null;
    this.systemId = systemId ?? null;
    this.internalSubset = internalSubset ?? null;
  }

  override get type() {
    return XmlNode.TYPE_DOCUMENT_TYPE;
  }

  override toJSON() {
    let json = XmlNode.prototype.toJSON.call(this);
    json.name = this.name;

    for (let key of ['publicId', 'systemId', 'internalSubset'] as const) {
      if (this[key] !== null) {
        json[key] = this[key];
      }
    }

    return json;
  }
}
