import type { JsonObject } from './types.js';
import type { XmlDocument } from './XmlDocument.js';
import type { XmlElement } from './XmlElement.js';

/**
 * Base interface for a node in an XML document.
 */
export class XmlNode {
  /**
   * Type value for an `XmlCdata` node.
   */
  static readonly TYPE_CDATA = 'cdata';

  /**
   * Type value for an `XmlComment` node.
   */
  static readonly TYPE_COMMENT = 'comment';

  /**
   * Type value for an `XmlDocument` node.
   */
  static readonly TYPE_DOCUMENT = 'document';

  /**
   * Type value for an `XmlDocumentType` node.
   */
  static readonly TYPE_DOCUMENT_TYPE = 'doctype';

  /**
   * Type value for an `XmlElement` node.
   */
  static readonly TYPE_ELEMENT = 'element';

  /**
   * Type value for an `XmlProcessingInstruction` node.
   */
  static readonly TYPE_PROCESSING_INSTRUCTION = 'pi';

  /**
   * Type value for an `XmlText` node.
   */
  static readonly TYPE_TEXT = 'text';

  /**
   * Type value for an `XmlDeclaration` node.
   */
  static readonly TYPE_XML_DECLARATION = 'xmldecl';

  /**
   * Parent node of this node, or `null` if this node has no parent.
   */
  parent: XmlDocument | XmlElement | null = null;

  /**
   * Starting byte offset of this node in the original XML string, or `-1` if
   * the offset is unknown.
   */
  start = -1;

  /**
   * Ending byte offset of this node in the original XML string, or `-1` if the
   * offset is unknown.
   */
  end = -1;

  /**
   * Document that contains this node, or `null` if this node is not associated
   * with a document.
   */
  get document(): XmlDocument | null {
    return this.parent?.document ?? null;
  }

  /**
   * Whether this node is the root node of the document (also known as the
   * document element).
   */
  get isRootNode(): boolean {
    return this.parent !== null
      && this.parent === this.document
      && this.type === XmlNode.TYPE_ELEMENT;
  }

  /**
   * Whether whitespace should be preserved in the content of this element and
   * its children.
   *
   * This is influenced by the value of the special `xml:space` attribute, and
   * will be `true` for any node whose `xml:space` attribute is set to
   * "preserve". If a node has no such attribute, it will inherit the value of
   * the nearest ancestor that does (if any).
   *
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-white-space
   */
  get preserveWhitespace(): boolean {
    return !!this.parent?.preserveWhitespace;
  }

  /**
   * Type of this node.
   *
   * The value of this property is a string that matches one of the static
   * `TYPE_*` properties on the `XmlNode` class (e.g. `TYPE_ELEMENT`,
   * `TYPE_TEXT`, etc.).
   *
   * The `XmlNode` class itself is a base class and doesn't have its own type
   * name.
   */
  get type() {
    return '';
  }

  /**
   * Returns a JSON-serializable object representing this node, minus properties
   * that could result in circular references.
   */
  toJSON(): JsonObject {
    let json: JsonObject = {
      type: this.type,
    };

    if (this.isRootNode) {
      json.isRootNode = true;
    }

    if (this.preserveWhitespace) {
      json.preserveWhitespace = true;
    }

    if (this.start !== -1) {
      json.start = this.start;
      json.end = this.end;
    }

    return json;
  }
}
