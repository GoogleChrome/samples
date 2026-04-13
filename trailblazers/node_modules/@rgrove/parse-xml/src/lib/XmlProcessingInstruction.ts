import { XmlNode } from './XmlNode.js';

/**
 * A processing instruction within an XML document.
 */
export class XmlProcessingInstruction extends XmlNode {
  /**
   * Content of this processing instruction.
   */
  content: string;

  /**
   * Name of this processing instruction. Also sometimes referred to as the
   * processing instruction "target".
   */
  name: string;

  constructor(name: string, content = '') {
    super();

    this.name = name;
    this.content = content;
  }

  override get type() {
    return XmlNode.TYPE_PROCESSING_INSTRUCTION;
  }

  override toJSON() {
    return Object.assign(XmlNode.prototype.toJSON.call(this), {
      name: this.name,
      content: this.content,
    });
  }
}
