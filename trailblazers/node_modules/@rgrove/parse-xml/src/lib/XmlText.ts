import { XmlNode } from './XmlNode.js';

/**
 * Text content within an XML document.
 */
export class XmlText extends XmlNode {
  /**
   * Text content of this node.
   */
  text: string;

  constructor(text = '') {
    super();
    this.text = text;
  }

  override get type() {
    return XmlNode.TYPE_TEXT;
  }

  override toJSON() {
    return Object.assign(XmlNode.prototype.toJSON.call(this), {
      text: this.text,
    });
  }
}
