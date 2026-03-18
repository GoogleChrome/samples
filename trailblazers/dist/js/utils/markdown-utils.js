/**
 * Escapes a string value for safe use in YAML frontmatter.
 * @param {string|any} val - The value to escape.
 * @return {string|any} The escaped value.
 */
export function escapeYamlValue(val) {
  if (typeof val !== 'string') {
    return val;
  }
  // Wrap in quotes if it contains YAML-special characters
  if (/[#:[\]{}>|&*?%@`']/.test(val) || val.includes(': ')) {
    return `"${val.replace(/"/g, '\\"')}"`;
  }
  return val;
}

/**
 * Generates a Markdown string with YAML frontmatter from draft data.
 * @param {Object} draft - The draft object.
 * @param {string} title - The post title.
 * @param {string} description - The post description.
 * @param {string} date - The post date.
 * @param {string} tagsValue - Comma-separated tags string.
 * @param {string} content - The post content.
 * @param {Array<Object>} [classifierResults=[]] - AI classifier results.
 * @return {string} The formatted Markdown string.
 */
export function generateMarkdown(
  draft,
  title,
  description,
  date,
  tagsValue,
  content,
  classifierResults = [],
) {
  const tags = tagsValue
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t);
  const escapedTags = tags.map((t) => `"${t.replace(/"/g, '\\"')}"`);
  const tagsYaml =
    escapedTags.length > 0 ? `tags: [${escapedTags.join(', ')}]` : 'tags: []';

  const classifierIds = classifierResults.map((r) => r.id);
  const classifierConfidences = classifierResults.map((r) => r.confidence);

  const frontmatter = [
    '---',
    `title: ${escapeYamlValue(title)}`,
    `description: ${escapeYamlValue(description)}`,
    `date: ${date}`,
    tagsYaml,
    classifierIds.length > 0
      ? `ad_categories: ${JSON.stringify(classifierIds)}`
      : '',
    classifierConfidences.length > 0
      ? `ad_confidences: ${JSON.stringify(classifierConfidences)}`
      : '',
    draft.translations
      ? `translations:\n${Object.entries(draft.translations)
          .map(([locale, data]) => `  ${locale}: ${escapeYamlValue(data.path)}`)
          .join('\n')}`
      : '',
    '---',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');

  return frontmatter + '\n\n' + content;
}
