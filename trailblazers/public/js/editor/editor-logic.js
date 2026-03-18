import { getImage } from '../utils/db-storage.js';
import { sanitizeHTML } from '../utils/sanitizer.js';
import { formatPreviewDate } from '../utils/date-utils.js';

/**
 * Cache for blob URLs to avoid redundant ObjectURL creations.
 */
const blobCache = new Map();

/**
 * Updates the blog post preview based on the current input values and draft data.
 * @param {string} currentId - The ID of the current draft.
 * @param {Object[]} drafts - The list of all drafts.
 * @param {Object} ui - The UI elements.
 * @return {Promise<void>}
 */
export async function updatePreview(currentId, drafts, ui) {
  const draft = drafts.find((d) => d.id === currentId);
  if (!draft) {
    return;
  }
  let content = ui.contentInput.value;
  if (draft.imageFiles) {
    for (const img of draft.imageFiles) {
      let blobUrl = blobCache.get(img.id);
      if (!blobUrl) {
        const data = await getImage(img.id);
        if (data) {
          const type =
            img.type ||
            (img.name.toLowerCase().endsWith('.svg')
              ? 'image/svg+xml'
              : 'image/jpeg');
          blobUrl = URL.createObjectURL(new Blob([data], { type }));
          blobCache.set(img.id, blobUrl);
        }
      }
      if (blobUrl) {
        content = content.replaceAll(`./${img.name}`, blobUrl);
      }
    }
  }
  const tagsHtml = ui
    .getTags()
    .map((t) => `<li><a href="#" class="post-tag">${t}</a></li>`)
    .join('');
  const dateHtml = ui.dateInput.value
    ? `<time datetime="${ui.dateInput.value}">${formatPreviewDate(ui.dateInput.value)}</time>`
    : '';
  const titleHtml = ui.titleInput.value
    ? `<h1>${ui.titleInput.value}</h1>`
    : '';
  const metadataHtml =
    dateHtml || tagsHtml
      ? `<ul class="post-metadata"><li>${dateHtml}</li>${tagsHtml}</ul>`
      : '';

  if (!ui.titleInput.value && !dateHtml && !tagsHtml && !content) {
    ui.previewContent.innerHTML = '';
  } else {
    await sanitizeHTML(
      ui.previewContent,
      `${titleHtml}${metadataHtml}${marked.parse(content)}`,
    );
  }
  if (window.Prism) {
    Prism.highlightAllUnder(ui.previewContent);
  }
}

export { wrapText } from '../utils/text-utils.js';
