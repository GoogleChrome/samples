import { XmlNode } from './XmlNode.js';

/**
 * A comment within an XML document.
 */
export class XmlComment extends XmlNode {
  /**
   * Content of this comment.
   */
  content: string;

  constructor(content = '') {
    super();
    this.content = content;
  }

  override get type() {
    return XmlNode.TYPE_COMMENT;
  }

  override toJSON() {
    return Object.assign(XmlNode.prototype.toJSON.call(this), {
      content: this.content,
    });
  }
}
