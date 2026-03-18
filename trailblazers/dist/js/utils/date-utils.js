/**
 * Formats a date string for the preview.
 * @param {string} dateStr - The date string from the input.
 * @return {string} The formatted date string.
 */
export function formatPreviewDate(dateStr) {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
