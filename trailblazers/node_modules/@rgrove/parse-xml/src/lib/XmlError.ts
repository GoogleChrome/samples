/**
 * An error that occurred while parsing XML.
 */
export class XmlError extends Error {
  /**
   * Character column at which this error occurred (1-based).
   */
  readonly column: number;

  /**
   * Short excerpt from the input string that contains the problem.
   */
  readonly excerpt: string;

  /**
   * Line number at which this error occurred (1-based).
   */
  readonly line: number;

  /**
   * Character position at which this error occurred relative to the beginning
   * of the input (0-based).
   */
  readonly pos: number;

  constructor(
    message: string,
    charIndex: number,
    xml: string,
  ) {
    let column = 1;
    let excerpt = '';
    let line = 1;

    // Find the line and column where the error occurred.
    for (let i = 0; i < charIndex; ++i) {
      let char = xml[i];

      if (char === '\n') {
        column = 1;
        excerpt = '';
        line += 1;
      } else {
        column += 1;
        excerpt += char;
      }
    }

    let eol = xml.indexOf('\n', charIndex);

    excerpt += eol === -1
      ? xml.slice(charIndex)
      : xml.slice(charIndex, eol);

    let excerptStart = 0;

    // Keep the excerpt below 50 chars, but always keep the error position in
    // view.
    if (excerpt.length > 50) {
      if (column < 40) {
        excerpt = excerpt.slice(0, 50);
      } else {
        excerptStart = column - 20;
        excerpt = excerpt.slice(excerptStart, column + 30);
      }
    }

    super(
      `${message} (line ${line}, column ${column})\n`
        + `  ${excerpt}\n`
        + ' '.repeat(column - excerptStart + 1) + '^\n',
    );

    this.column = column;
    this.excerpt = excerpt;
    this.line = line;
    this.name = 'XmlError';
    this.pos = charIndex;
  }
}
