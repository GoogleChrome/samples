import { XmlNode } from './XmlNode.js';
import { XmlText } from './XmlText.js';

/**
 * A CDATA section within an XML document.
 */
export class XmlCdata extends XmlText {
  override get type() {
    return XmlNode.TYPE_CDATA;
  }
}
