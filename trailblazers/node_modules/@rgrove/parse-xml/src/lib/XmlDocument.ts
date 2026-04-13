import { XmlElement } from './XmlElement.js';
import { XmlNode } from './XmlNode.js';

import type { XmlComment } from './XmlComment.js';
import type { XmlDeclaration } from './XmlDeclaration.js';
import type { XmlDocumentType } from './XmlDocumentType.js';
import type { XmlProcessingInstruction } from './XmlProcessingInstruction.js';

/**
 * Represents an XML document. All elements within the document are descendants
 * of this node.
 */
export class XmlDocument extends XmlNode {
  /**
   * Child nodes of this document.
   */
  readonly children: Array<XmlComment | XmlDeclaration | XmlDocumentType | XmlProcessingInstruction | XmlElement>;

  constructor(children: Array<XmlComment | XmlDeclaration | XmlDocumentType | XmlElement | XmlProcessingInstruction> = []) {
    super();
    this.children = children;
  }

  override get document() {
    return this;
  }

  /**
   * Root element of this document, or `null` if this document is empty.
   */
  get root(): XmlElement | null {
    for (let child of this.children) {
      if (child instanceof XmlElement) {
        return child;
      }
    }

    return null;
  }

  /**
   * Text content of this document and all its descendants.
   */
  get text(): string {
    return this.children
      .map(child => 'text' in child ? child.text : '')
      .join('');
  }

  override get type() {
    return XmlNode.TYPE_DOCUMENT;
  }

  override toJSON() {
    return Object.assign(XmlNode.prototype.toJSON.call(this), {
      children: this.children.map(child => child.toJSON()),
    });
  }
}
