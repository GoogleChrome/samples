const emptyString = '';
const surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

/** @private */
export class StringScanner {
  charIndex: number;
  readonly string: string;

  private readonly charCount: number;
  private readonly charsToBytes: number[] | undefined;
  private readonly length: number;
  private readonly multiByteMode: boolean;

  constructor(string: string) {
    this.charCount = this.charLength(string, true);
    this.charIndex = 0;
    this.length = string.length;
    this.multiByteMode = this.charCount !== this.length;
    this.string = string;

    if (this.multiByteMode) {
      let charsToBytes = [];

      // Create a mapping of character indexes to byte indexes. Since the string
      // contains multibyte characters, a byte index may not necessarily align
      // with a character index.
      for (let byteIndex = 0, charIndex = 0; charIndex < this.charCount; ++charIndex) {
        charsToBytes[charIndex] = byteIndex;
        byteIndex += (string.codePointAt(byteIndex) as number) > 65535 ? 2 : 1;
      }

      this.charsToBytes = charsToBytes;
    }
  }

  /**
   * Whether the current character index is at the end of the input string.
   */
  get isEnd() {
    return this.charIndex >= this.charCount;
  }

  // -- Protected Methods ------------------------------------------------------

  /**
   * Returns the number of characters in the given string, which may differ from
   * the byte length if the string contains multibyte characters.
   */
  protected charLength(string: string, multiByteSafe = this.multiByteMode): number {
    // We could get the char length with `[ ...string ].length`, but that's
    // actually slower than replacing surrogate pairs with single-byte
    // characters and then counting the result.
    return multiByteSafe
      ? string.replace(surrogatePair, '_').length
      : string.length;
  }

  // -- Public Methods ---------------------------------------------------------

  /**
   * Advances the scanner by the given number of characters, stopping if the end
   * of the string is reached.
   */
  advance(count = 1) {
    this.charIndex = Math.min(this.charCount, this.charIndex + count);
  }

  /**
   * Returns the byte index of the given character index in the string. The two
   * may differ in strings that contain multibyte characters.
   */
  charIndexToByteIndex(charIndex: number = this.charIndex): number {
    return this.multiByteMode
      ? (this.charsToBytes as number[])[charIndex] ?? Infinity
      : charIndex;
  }

  /**
   * Consumes and returns the given number of characters if possible, advancing
   * the scanner and stopping if the end of the string is reached.
   *
   * If no characters could be consumed, an empty string will be returned.
   */
  consume(charCount = 1): string {
    let chars = this.peek(charCount);
    this.advance(charCount);
    return chars;
  }

  /**
   * Consumes and returns the given number of bytes if possible, advancing the
   * scanner and stopping if the end of the string is reached.
   *
   * It's up to the caller to ensure that the given byte count doesn't split a
   * multibyte character.
   *
   * If no bytes could be consumed, an empty string will be returned.
   */
  consumeBytes(byteCount: number): string {
    let byteIndex = this.charIndexToByteIndex();
    let result = this.string.slice(byteIndex, byteIndex + byteCount);
    this.advance(this.charLength(result));
    return result;
  }

  /**
   * Consumes and returns all characters for which the given function returns
   * `true`, stopping when `false` is returned or the end of the input is
   * reached.
   */
  consumeMatchFn(fn: (char: string) => boolean): string {
    let { length, multiByteMode, string } = this;
    let startByteIndex = this.charIndexToByteIndex();
    let endByteIndex = startByteIndex;

    if (multiByteMode) {
      while (endByteIndex < length) {
        let char = string[endByteIndex] as string;
        let isSurrogatePair = char >= '\uD800' && char <= '\uDBFF';

        if (isSurrogatePair) {
          char += string[endByteIndex + 1];
        }

        if (!fn(char)) {
          break;
        }

        endByteIndex += isSurrogatePair ? 2 : 1;
      }
    } else {
      while (endByteIndex < length && fn(string[endByteIndex] as string)) {
        ++endByteIndex;
      }
    }

    return this.consumeBytes(endByteIndex - startByteIndex);
  }

  /**
   * Consumes the given string if it exists at the current character index, and
   * advances the scanner.
   *
   * If the given string doesn't exist at the current character index, an empty
   * string will be returned and the scanner will not be advanced.
   */
  consumeString(stringToConsume: string): string {
    let { length } = stringToConsume;
    let byteIndex = this.charIndexToByteIndex();

    if (stringToConsume === this.string.slice(byteIndex, byteIndex + length)) {
      this.advance(length === 1 ? 1 : this.charLength(stringToConsume));
      return stringToConsume;
    }

    return emptyString;
  }

  /**
   * Consumes characters until the given global regex is matched, advancing the
   * scanner up to (but not beyond) the beginning of the match. If the regex
   * doesn't match, nothing will be consumed.
   *
   * Returns the consumed string, or an empty string if nothing was consumed.
   */
  consumeUntilMatch(regex: RegExp): string {
    let matchByteIndex = this.string
      .slice(this.charIndexToByteIndex())
      .search(regex);

    return matchByteIndex > 0
      ? this.consumeBytes(matchByteIndex)
      : emptyString;
  }

  /**
   * Consumes characters until the given string is found, advancing the scanner
   * up to (but not beyond) that point. If the string is never found, nothing
   * will be consumed.
   *
   * Returns the consumed string, or an empty string if nothing was consumed.
   */
  consumeUntilString(searchString: string): string {
    let byteIndex = this.charIndexToByteIndex();
    let matchByteIndex = this.string.indexOf(searchString, byteIndex);

    return matchByteIndex > 0
      ? this.consumeBytes(matchByteIndex - byteIndex)
      : emptyString;
  }

  /**
   * Returns the given number of characters starting at the current character
   * index, without advancing the scanner and without exceeding the end of the
   * input string.
   */
  peek(count = 1): string {
    let { charIndex, string } = this;

    return this.multiByteMode
      ? string.slice(this.charIndexToByteIndex(charIndex), this.charIndexToByteIndex(charIndex + count))
      : string.slice(charIndex, charIndex + count);
  }

  /**
   * Resets the scanner position to the given character _index_, or to the start
   * of the input string if no index is given.
   *
   * If _index_ is negative, the scanner position will be moved backward by that
   * many characters, stopping if the beginning of the string is reached.
   */
  reset(index = 0) {
    this.charIndex = index >= 0
      ? Math.min(this.charCount, index)
      : Math.max(0, this.charIndex + index);
  }
}
