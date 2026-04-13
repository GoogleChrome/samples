import { XmlNode } from './XmlNode.js';

import type { JsonObject } from './types.js';
import type { XmlCdata } from './XmlCdata.js';
import type { XmlComment } from './XmlComment.js';
import type { XmlProcessingInstruction } from './XmlProcessingInstruction.js';
import type { XmlText } from './XmlText.js';

/**
 * Element in an XML document.
 */
export class XmlElement extends XmlNode {
  /**
   * Attributes on this element.
   */
  attributes: {[attrName: string]: string};

  /**
   * Child nodes of this element.
   */
  children: Array<XmlCdata | XmlComment | XmlElement | XmlProcessingInstruction | XmlText>;

  /**
   * Name of this element.
   */
  name: string;

  constructor(
    name: string,
    attributes: {[attrName: string]: string} = Object.create(null),
    children: Array<XmlCdata | XmlComment | XmlElement | XmlProcessingInstruction | XmlText> = [],
  ) {
    super();

    this.name = name;
    this.attributes = attributes;
    this.children = children;
  }

  /**
   * Whether this element is empty (meaning it has no children).
   */
  get isEmpty(): boolean {
    return this.children.length === 0;
  }

  override get preserveWhitespace(): boolean {
    let node: XmlNode | null = this; // eslint-disable-line @typescript-eslint/no-this-alias

    while (node instanceof XmlElement) {
      if ('xml:space' in node.attributes) {
        return node.attributes['xml:space'] === 'preserve';
      }

      node = node.parent;
    }

    return false;
  }

  /**
   * Text content of this element and all its descendants.
   */
  get text(): string {
    return this.children
      .map(child => 'text' in child ? child.text : '')
      .join('');
  }

  override get type() {
    return XmlNode.TYPE_ELEMENT;
  }

  override toJSON(): JsonObject {
    return Object.assign(XmlNode.prototype.toJSON.call(this), {
      name: this.name,
      attributes: this.attributes,
      children: this.children.map(child => child.toJSON()),
    });
  }
}
