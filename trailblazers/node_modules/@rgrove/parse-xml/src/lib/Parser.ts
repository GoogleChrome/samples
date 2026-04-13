import { StringScanner } from './StringScanner.js';
import * as syntax from './syntax.js';
import { XmlCdata } from './XmlCdata.js';
import { XmlComment } from './XmlComment.js';
import { XmlDeclaration } from './XmlDeclaration.js';
import { XmlDocument } from './XmlDocument.js';
import { XmlDocumentType } from './XmlDocumentType.js';
import { XmlElement } from './XmlElement.js';
import { XmlError } from './XmlError.js';
import { XmlNode } from './XmlNode.js';
import { XmlProcessingInstruction } from './XmlProcessingInstruction.js';
import { XmlText } from './XmlText.js';

const emptyString = '';

/**
 * Parses an XML string into an `XmlDocument`.
 *
 * @private
 */
export class Parser {
  readonly document: XmlDocument;

  private currentNode: XmlDocument | XmlElement;
  private readonly options: ParserOptions;
  private readonly scanner: StringScanner;

  /**
   * @param xml XML string to parse.
   * @param options Parser options.
   */
  constructor(xml: string, options: ParserOptions = {}) {
    let doc = this.document = new XmlDocument();

    this.currentNode = doc;
    this.options = options;
    this.scanner = new StringScanner(xml);

    if (this.options.includeOffsets) {
      doc.start = 0;
      doc.end = xml.length;
    }

    this.parse();
  }

  /**
   * Adds the given `XmlNode` as a child of `this.currentNode`.
   */
  addNode(node: XmlNode, charIndex: number) {
    node.parent = this.currentNode;

    if (this.options.includeOffsets) {
      node.start = this.scanner.charIndexToByteIndex(charIndex);
      node.end = this.scanner.charIndexToByteIndex();
    }

    // @ts-expect-error: XmlDocument has a more limited set of possible children
    // than XmlElement so TypeScript is unhappy, but we always do the right
    // thing.
    this.currentNode.children.push(node);
    return true;
  }

  /**
   * Adds the given _text_ to the document, either by appending it to a
   * preceding `XmlText` node (if possible) or by creating a new `XmlText` node.
   */
  addText(text: string, charIndex: number) {
    let { children } = this.currentNode;
    let { length } = children;

    text = normalizeLineBreaks(text);

    if (length > 0) {
      let prevNode = children[length - 1];

      if (prevNode?.type === XmlNode.TYPE_TEXT) {
        let textNode = prevNode as XmlText;

        // The previous node is a text node, so we can append to it and avoid
        // creating another node.
        textNode.text += text;

        if (this.options.includeOffsets) {
          textNode.end = this.scanner.charIndexToByteIndex();
        }

        return true;
      }
    }

    return this.addNode(new XmlText(text), charIndex);
  }

  /**
   * Consumes element attributes.
   *
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-starttags
   */
  consumeAttributes(): Record<string, string> {
    let attributes = Object.create(null);

    while (this.consumeWhitespace()) {
      let attrName = this.consumeName();

      if (!attrName) {
        break;
      }

      let attrValue = this.consumeEqual() && this.consumeAttributeValue();

      if (attrValue === false) {
        throw this.error('Attribute value expected');
      }

      if (attrName in attributes) {
        throw this.error(`Duplicate attribute: ${attrName}`);
      }

      if (attrName === 'xml:space'
          && attrValue !== 'default'
          && attrValue !== 'preserve') {

        throw this.error('Value of the `xml:space` attribute must be "default" or "preserve"');
      }

      attributes[attrName] = attrValue;
    }

    if (this.options.sortAttributes) {
      let attrNames = Object.keys(attributes).sort();
      let sortedAttributes = Object.create(null);

      for (let i = 0; i < attrNames.length; ++i) {
        let attrName = attrNames[i] as string;
        sortedAttributes[attrName] = attributes[attrName];
      }

      attributes = sortedAttributes;
    }

    return attributes;
  }

  /**
   * Consumes an `AttValue` (attribute value) if possible.
   *
   * @returns
   *   Contents of the `AttValue` minus quotes, or `false` if nothing was
   *   consumed. An empty string indicates that an `AttValue` was consumed but
   *   was empty.
   *
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-AttValue
   */
  consumeAttributeValue(): string | false {
    let { scanner } = this;
    let quote = scanner.peek();

    if (quote !== '"' && quote !== "'") {
      return false;
    }

    scanner.advance();

    let chars;
    let isClosed = false;
    let value = emptyString;
    let regex = quote === '"'
      ? syntax.attValueCharDoubleQuote
      : syntax.attValueCharSingleQuote;

    matchLoop: while (!scanner.isEnd) {
      chars = scanner.consumeUntilMatch(regex);

      if (chars) {
        this.validateChars(chars);
        value += chars.replace(syntax.attValueNormalizedWhitespace, ' ');
      }

      switch (scanner.peek()) {
        case quote:
          isClosed = true;
          break matchLoop;

        case '&':
          value += this.consumeReference();
          continue;

        case '<':
          throw this.error('Unescaped `<` is not allowed in an attribute value');

        default:
          break matchLoop;
      }
    }

    if (!isClosed) {
      throw this.error('Unclosed attribute');
    }

    scanner.advance();
    return value;
  }

  /**
   * Consumes a CDATA section if possible.
   *
   * @returns Whether a CDATA section was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-cdata-sect
   */
  consumeCdataSection(): boolean {
    let { scanner } = this;
    let startIndex = scanner.charIndex;

    if (!scanner.consumeString('<![CDATA[')) {
      return false;
    }

    let text = scanner.consumeUntilString(']]>');
    this.validateChars(text);

    if (!scanner.consumeString(']]>')) {
      throw this.error('Unclosed CDATA section');
    }

    return this.options.preserveCdata
      ? this.addNode(new XmlCdata(normalizeLineBreaks(text)), startIndex)
      : this.addText(text, startIndex);
  }

  /**
   * Consumes character data if possible.
   *
   * @returns Whether character data was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#dt-chardata
   */
  consumeCharData(): boolean {
    let { scanner } = this;
    let startIndex = scanner.charIndex;
    let charData = scanner.consumeUntilMatch(syntax.endCharData);

    if (!charData) {
      return false;
    }

    this.validateChars(charData);

    if (scanner.peek(3) === ']]>') {
      throw this.error('Element content may not contain the CDATA section close delimiter `]]>`');
    }

    return this.addText(charData, startIndex);
  }

  /**
   * Consumes a comment if possible.
   *
   * @returns Whether a comment was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-Comment
   */
  consumeComment(): boolean {
    let { scanner } = this;
    let startIndex = scanner.charIndex;

    if (!scanner.consumeString('<!--')) {
      return false;
    }

    let content = scanner.consumeUntilString('--');
    this.validateChars(content);

    if (!scanner.consumeString('-->')) {
      if (scanner.peek(2) === '--') {
        throw this.error("The string `--` isn't allowed inside a comment");
      }

      throw this.error('Unclosed comment');
    }

    return this.options.preserveComments
      ? this.addNode(new XmlComment(normalizeLineBreaks(content)), startIndex)
      : true;
  }

  /**
   * Consumes a reference in a content context if possible.
   *
   * This differs from `consumeReference()` in that a consumed reference will be
   * added to the document as a text node instead of returned.
   *
   * @returns Whether a reference was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#entproc
   */
  consumeContentReference(): boolean {
    let startIndex = this.scanner.charIndex;
    let ref = this.consumeReference();

    return ref
      ? this.addText(ref, startIndex)
      : false;
  }

  /**
   * Consumes a doctype declaration if possible.
   *
   * This is a loose implementation since doctype declarations are currently
   * discarded without further parsing.
   *
   * @returns Whether a doctype declaration was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#dtd
   */
  consumeDoctypeDeclaration(): boolean {
    let { scanner } = this;
    let startIndex = scanner.charIndex;

    if (!scanner.consumeString('<!DOCTYPE')) {
      return false;
    }

    let name = this.consumeWhitespace()
      && this.consumeName();

    if (!name) {
      throw this.error('Expected a name');
    }

    let publicId;
    let systemId;

    if (this.consumeWhitespace()) {
      if (scanner.consumeString('PUBLIC')) {
        publicId = this.consumeWhitespace()
          && this.consumePubidLiteral();

        if (publicId === false) {
          throw this.error('Expected a public identifier');
        }

        this.consumeWhitespace();
      }

      if (publicId !== undefined || scanner.consumeString('SYSTEM')) {
        this.consumeWhitespace();
        systemId = this.consumeSystemLiteral();

        if (systemId === false) {
          throw this.error('Expected a system identifier');
        }

        this.consumeWhitespace();
      }
    }

    let internalSubset;

    if (scanner.consumeString('[')) {
      // The internal subset may contain comments that contain `]` characters,
      // so we can't use `consumeUntilString()` here.
      internalSubset = scanner.consumeUntilMatch(/\][\x20\t\r\n]*>/);

      if (!scanner.consumeString(']')) {
        throw this.error('Unclosed internal subset');
      }

      this.consumeWhitespace();
    }

    if (!scanner.consumeString('>')) {
      throw this.error('Unclosed doctype declaration');
    }

    return this.options.preserveDocumentType
      ? this.addNode(new XmlDocumentType(name, publicId, systemId, internalSubset), startIndex)
      : true;
    }

  /**
   * Consumes an element if possible.
   *
   * @returns Whether an element was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-element
   */
  consumeElement(): boolean {
    let { scanner } = this;
    let startIndex = scanner.charIndex;

    if (!scanner.consumeString('<')) {
      return false;
    }

    let name = this.consumeName();

    if (!name) {
      scanner.reset(startIndex);
      return false;
    }

    let attributes = this.consumeAttributes();
    let isEmpty = !!scanner.consumeString('/>');
    let element = new XmlElement(name, attributes);

    element.parent = this.currentNode;

    if (!isEmpty) {
      if (!scanner.consumeString('>')) {
        throw this.error(`Unclosed start tag for element \`${name}\``);
      }

      this.currentNode = element;

      do {
        this.consumeCharData();
      } while (
        this.consumeElement()
          || this.consumeContentReference()
          || this.consumeCdataSection()
          || this.consumeProcessingInstruction()
          || this.consumeComment()
      );

      let endTagMark = scanner.charIndex;
      let endTagName;

      if (!scanner.consumeString('</')
          || !(endTagName = this.consumeName())
          || endTagName !== name) {

        scanner.reset(endTagMark);
        throw this.error(`Missing end tag for element ${name}`);
      }

      this.consumeWhitespace();

      if (!scanner.consumeString('>')) {
        throw this.error(`Unclosed end tag for element ${name}`);
      }

      this.currentNode = element.parent;
    }

    return this.addNode(element, startIndex);
  }

  /**
   * Consumes an `Eq` production if possible.
   *
   * @returns Whether an `Eq` production was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-Eq
   */
  consumeEqual(): boolean {
    this.consumeWhitespace();

    if (this.scanner.consumeString('=')) {
      this.consumeWhitespace();
      return true;
    }

    return false;
  }

  /**
   * Consumes `Misc` content if possible.
   *
   * @returns Whether anything was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-Misc
   */
  consumeMisc(): boolean {
    return this.consumeComment()
      || this.consumeProcessingInstruction()
      || this.consumeWhitespace();
  }

  /**
   * Consumes one or more `Name` characters if possible.
   *
   * @returns `Name` characters, or an empty string if none were consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-Name
   */
  consumeName(): string {
    return syntax.isNameStartChar(this.scanner.peek())
      ? this.scanner.consumeMatchFn(syntax.isNameChar)
      : emptyString;
  }

  /**
   * Consumes a processing instruction if possible.
   *
   * @returns Whether a processing instruction was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-pi
   */
  consumeProcessingInstruction(): boolean {
    let { scanner } = this;
    let startIndex = scanner.charIndex;

    if (!scanner.consumeString('<?')) {
      return false;
    }

    let name = this.consumeName();

    if (name) {
      if (name.toLowerCase() === 'xml') {
        scanner.reset(startIndex);
        throw this.error("XML declaration isn't allowed here");
      }
    } else {
      throw this.error('Invalid processing instruction');
    }

    if (!this.consumeWhitespace()) {
      if (scanner.consumeString('?>')) {
        return this.addNode(new XmlProcessingInstruction(name), startIndex);
      }

      throw this.error('Whitespace is required after a processing instruction name');
    }

    let content = scanner.consumeUntilString('?>');
    this.validateChars(content);

    if (!scanner.consumeString('?>')) {
      throw this.error('Unterminated processing instruction');
    }

    return this.addNode(new XmlProcessingInstruction(name, normalizeLineBreaks(content)), startIndex);
  }

  /**
   * Consumes a prolog if possible.
   *
   * @returns Whether a prolog was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-prolog-dtd
   */
  consumeProlog(): boolean {
    let { scanner } = this;
    let startIndex = scanner.charIndex;

    this.consumeXmlDeclaration();

    while (this.consumeMisc()) {} // eslint-disable-line no-empty

    if (this.consumeDoctypeDeclaration()) {
      while (this.consumeMisc()) {} // eslint-disable-line no-empty
    }

    return startIndex < scanner.charIndex;
  }

  /**
   * Consumes a public identifier literal if possible.
   *
   * @returns
   *   Value of the public identifier literal minus quotes, or `false` if
   *   nothing was consumed. An empty string indicates that a public id literal
   *   was consumed but was empty.
   *
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-PubidLiteral
   */
  consumePubidLiteral(): string | false {
    let startIndex = this.scanner.charIndex;
    let value = this.consumeSystemLiteral();

    if (value !== false && !/^[-\x20\r\na-zA-Z0-9'()+,./:=?;!*#@$_%]*$/.test(value)) {
      this.scanner.reset(startIndex);
      throw this.error('Invalid character in public identifier');
    }

    return value;
  }

  /**
   * Consumes a reference if possible.
   *
   * This differs from `consumeContentReference()` in that a consumed reference
   * will be returned rather than added to the document.
   *
   * @returns
   *   Parsed reference value, or `false` if nothing was consumed (to
   *   distinguish from a reference that resolves to an empty string).
   *
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-Reference
   */
  consumeReference(): string | false {
    let { scanner } = this;

    if (!scanner.consumeString('&')) {
      return false;
    }

    let ref = scanner.consumeMatchFn(syntax.isReferenceChar);

    if (scanner.consume() !== ';') {
      throw this.error('Unterminated reference (a reference must end with `;`)');
    }

    let parsedValue;

    if (ref[0] === '#') {
      // This is a character reference.
      let codePoint = ref[1] === 'x'
        ? parseInt(ref.slice(2), 16) // Hex codepoint.
        : parseInt(ref.slice(1), 10); // Decimal codepoint.

      if (isNaN(codePoint)) {
        throw this.error('Invalid character reference');
      }

      if (!syntax.isXmlCodePoint(codePoint)) {
        throw this.error('Character reference resolves to an invalid character');
      }

      parsedValue = String.fromCodePoint(codePoint);
    } else {
      // This is an entity reference.
      parsedValue = syntax.predefinedEntities[ref];

      if (parsedValue === undefined) {
        let {
          ignoreUndefinedEntities,
          resolveUndefinedEntity,
        } = this.options;

        let wrappedRef = `&${ref};`; // for backcompat with <= 2.x

        if (resolveUndefinedEntity) {
          let resolvedValue = resolveUndefinedEntity(wrappedRef);

          if (resolvedValue !== null && resolvedValue !== undefined) {
            let type = typeof resolvedValue;

            if (type !== 'string') {
              throw new TypeError(`\`resolveUndefinedEntity()\` must return a string, \`null\`, or \`undefined\`, but returned a value of type ${type}`);
            }

            return resolvedValue;
          }
        }

        if (ignoreUndefinedEntities) {
          return wrappedRef;
        }

        scanner.reset(-wrappedRef.length);
        throw this.error(`Named entity isn't defined: ${wrappedRef}`);
      }
    }

    return parsedValue;
  }

  /**
   * Consumes a `SystemLiteral` if possible.
   *
   * A `SystemLiteral` is similar to an attribute value, but allows the
   * characters `<` and `&` and doesn't replace references.
   *
   * @returns
   *   Value of the `SystemLiteral` minus quotes, or `false` if nothing was
   *   consumed. An empty string indicates that a `SystemLiteral` was consumed
   *   but was empty.
   *
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-SystemLiteral
   */
  consumeSystemLiteral(): string | false {
    let { scanner } = this;
    let quote = scanner.consumeString('"') || scanner.consumeString("'");

    if (!quote) {
      return false;
    }

    let value = scanner.consumeUntilString(quote);
    this.validateChars(value);

    if (!scanner.consumeString(quote)) {
      throw this.error('Missing end quote');
    }

    return value;
  }

  /**
   * Consumes one or more whitespace characters if possible.
   *
   * @returns Whether any whitespace characters were consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#white
   */
  consumeWhitespace(): boolean {
    return !!this.scanner.consumeMatchFn(syntax.isWhitespace);
  }

  /**
   * Consumes an XML declaration if possible.
   *
   * @returns Whether an XML declaration was consumed.
   * @see https://www.w3.org/TR/2008/REC-xml-20081126/#NT-XMLDecl
   */
  consumeXmlDeclaration(): boolean {
    let { scanner } = this;
    let startIndex = scanner.charIndex;

    if (!scanner.consumeString('<?xml')) {
      return false;
    }

    if (!this.consumeWhitespace()) {
      throw this.error('Invalid XML declaration');
    }

    let version = !!scanner.consumeString('version')
      && this.consumeEqual()
      && this.consumeSystemLiteral();

    if (version === false) {
      throw this.error('XML version is missing or invalid');
    } else if (!/^1\.[0-9]+$/.test(version)) {
      throw this.error('Invalid character in version number');
    }

    let encoding;
    let standalone;

    if (this.consumeWhitespace()) {
      encoding = !!scanner.consumeString('encoding')
        && this.consumeEqual()
        && this.consumeSystemLiteral();

      if (encoding) {
        if (!/^[A-Za-z][\w.-]*$/.test(encoding)) {
          throw this.error('Invalid character in encoding name');
        }
        this.consumeWhitespace();
      }

      standalone = !!scanner.consumeString('standalone')
        && this.consumeEqual()
        && this.consumeSystemLiteral();

      if (standalone) {
        if (standalone !== 'yes' && standalone !== 'no') {
          throw this.error('Only "yes" and "no" are permitted as values of `standalone`');
        }

        this.consumeWhitespace();
      }
    }

    if (!scanner.consumeString('?>')) {
      throw this.error('Invalid or unclosed XML declaration');
    }

    return this.options.preserveXmlDeclaration
      ? this.addNode(new XmlDeclaration(
          version,
          encoding || undefined,
          (standalone as 'yes' | 'no' | false) || undefined,
        ), startIndex)
      : true;
  }

  /**
   * Returns an `XmlError` for the current scanner position.
   */
  error(message: string) {
    let { scanner } = this;
    return new XmlError(message, scanner.charIndex, scanner.string);
  }

  /**
   * Parses the XML input.
   */
  parse() {
    this.scanner.consumeString('\uFEFF'); // byte order mark
    this.consumeProlog();

    if (!this.consumeElement()) {
      throw this.error('Root element is missing or invalid');
    }

    while (this.consumeMisc()) {} // eslint-disable-line no-empty

    if (!this.scanner.isEnd) {
      throw this.error('Extra content at the end of the document');
    }
  }

  /**
   * Throws an invalid character error if any character in the given _string_
   * isn't a valid XML character.
   */
  validateChars(string: string) {
    let { length } = string;

    for (let i = 0; i < length; ++i) {
      let cp = string.codePointAt(i) as number;

      if (!syntax.isXmlCodePoint(cp)) {
        this.scanner.reset(-([ ...string ].length - i));
        throw this.error('Invalid character');
      }

      if (cp > 65535) {
        i += 1;
      }
    }
  }
}

// -- Private Functions --------------------------------------------------------

/**
 * Normalizes line breaks in the given text by replacing CRLF sequences and lone
 * CR characters with LF characters.
 */
function normalizeLineBreaks(text: string): string {
  let i = 0;

  while ((i = text.indexOf('\r', i)) !== -1) {
    text = text[i + 1] === '\n'
      ? text.slice(0, i) + text.slice(i + 1)
      : text.slice(0, i) + '\n' + text.slice(i + 1);
  }

  return text;
}

// -- Types --------------------------------------------------------------------
export type ParserOptions = {
  /**
   * When `true`, an undefined named entity (like "&bogus;") will be left in the
   * output as is instead of causing a parse error.
   *
   * @default false
   */
  ignoreUndefinedEntities?: boolean;

  /**
   * When `true`, the starting and ending byte offsets of each node in the input
   * string will be made available via `start` and `end` properties on the node.
   *
   * @default false
   */
  includeOffsets?: boolean;

  /**
   * When `true`, CDATA sections will be preserved in the document as `XmlCdata`
   * nodes. Otherwise CDATA sections will be represented as `XmlText` nodes,
   * which keeps the node tree simpler and easier to work with.
   *
   * @default false
   */
  preserveCdata?: boolean;

  /**
   * When `true`, comments will be preserved in the document as `XmlComment`
   * nodes. Otherwise comments will not be included in the node tree.
   *
   * @default false
   */
  preserveComments?: boolean;

  /**
   * When `true`, a document type declaration (if present) will be preserved in
   * the document as an `XmlDocumentType` node. Otherwise the declaration will
   * not be included in the node tree.
   *
   * Note that when this is `true` and a document type declaration is present,
   * the DTD will precede the root node in the node tree (normally the root
   * node would be first).
   *
   * @default false
   */
  preserveDocumentType?: boolean;

  /**
   * When `true`, an XML declaration (if present) will be preserved in the
   * document as an `XmlDeclaration` node. Otherwise the declaration will not be
   * included in the node tree.
   *
   * Note that when this is `true` and an XML declaration is present, the
   * XML declaration will be the first child of the document (normally the root
   * node would be first).
   *
   * @default false
   */
  preserveXmlDeclaration?: boolean;

  /**
   * When an undefined named entity is encountered, this function will be called
   * with the entity as its only argument. It should return a string value with
   * which to replace the entity, or `null` or `undefined` to treat the entity
   * as undefined (which may result in a parse error depending on the value of
   * `ignoreUndefinedEntities`).
   */
  resolveUndefinedEntity?: (entity: string) => string | null | undefined;

  /**
   * When `true`, attributes in an element's `attributes` object will be sorted
   * in alphanumeric order by name. Otherwise they'll retain their original
   * order as found in the XML.
   *
   * @default false
   */
  sortAttributes?: boolean;
};
