/**
 * Parses Jekyll/Eleventy style frontmatter from a string.
 * @param {string} text - The input text containing frontmatter.
 * @return {Object} An object containing the parsed metadata and the remaining content.
 */
export function parseFrontmatter(text) {
  const regex = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;
  const match = text.match(regex);
  if (!match) {
    return { content: text };
  }

  const yaml = match[1];
  const content = match[2];
  const metadata = {};

  yaml.split('\n').forEach((line) => {
    const part = line.match(/^\s*([^:]+):\s*(.*)$/);
    if (part) {
      const key = part[1].trim();
      let value = part[2].trim();

      // Basic cleanup for values (remove quotes, handle arrays)
      value = value.replace(/^["']|["']$/g, '');
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((v) => v.trim().replace(/^["']|["']$/g, ''));
      }

      metadata[key] = value;
    }
  });

  return { metadata, content };
}

/**
 * Populates the editor UI with values from the parsed metadata.
 * @param {Object} metadata - The metadata object.
 * @param {Object} ui - The UI elements.
 * @param {Object} tagEditor - The tag editor component instance.
 */
export async function populateUIFromMetadata(metadata, ui, tagEditor) {
  if (metadata.title) {
    ui.titleInput.value = metadata.title;
  }
  if (metadata.description) {
    ui.descInput.value = metadata.description;
  }
  if (metadata.date) {
    ui.dateInput.value = metadata.date;
  }
  if (metadata.tags) {
    const tags = Array.isArray(metadata.tags)
      ? metadata.tags.join(', ')
      : metadata.tags;
    ui.tagsInput.value = tags;
    tagEditor.renderPills();
  }

  if (metadata.ad_categories && window.renderClassifierResults) {
    const categories = Array.isArray(metadata.ad_categories)
      ? metadata.ad_categories
      : [metadata.ad_categories];
    const confidences = Array.isArray(metadata.ad_confidences)
      ? metadata.ad_confidences
      : [metadata.ad_confidences];

    const results = categories.map((id, i) => ({
      id,
      confidence: confidences[i] ? parseFloat(confidences[i]) : null,
    }));

    await window.renderClassifierResults(ui, results, () => {
      if (window.sync) {
        window.sync();
      }
    });
  }
}
