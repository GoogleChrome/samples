/**
 * Wraps text to a specify line length.
 * @param {string} text - The text to wrap.
 * @param {number} limit - The maximum character limit per line.
 * @return {string} The wrapped text.
 */
export function wrapText(text, limit) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  words.forEach((word) => {
    if ((currentLine + word).length > limit) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  lines.push(currentLine.trim());
  return lines.join('\n    ');
}
