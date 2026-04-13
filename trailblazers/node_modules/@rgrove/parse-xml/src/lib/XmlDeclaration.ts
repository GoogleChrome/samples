import { XmlNode } from './XmlNode.js';

/**
 * An XML declaration within an XML document.
 *
 * @example
 *
 * ```xml
 * <?xml version="1.0" encoding="UTF-8"?>
 * ```
 */
export class XmlDeclaration extends XmlNode {
  /**
   * Value of the encoding declaration in this XML declaration, or `null` if no
   * encoding declaration was present.
   */
  encoding: string | null;

  /**
   * Value of the standalone declaration in this XML declaration, or `null` if
   * no standalone declaration was present.
   */
  standalone: 'yes' | 'no' | null;

  /**
   * Value of the version declaration in this XML declaration.
   */
  version: string;

  constructor(
    version: string,
    encoding?: string,
    standalone?: typeof XmlDeclaration.prototype.standalone,
  ) {
    super();

    this.version = version;
    this.encoding = encoding ?? null;
    this.standalone = standalone ?? null;
  }

  override get type() {
    return XmlNode.TYPE_XML_DECLARATION;
  }

  override toJSON() {
    let json = XmlNode.prototype.toJSON.call(this);
    json.version = this.version;

    for (let key of ['encoding', 'standalone'] as const) {
      if (this[key] !== null) {
        json[key] = this[key];
      }
    }

    return json;
  }
}
