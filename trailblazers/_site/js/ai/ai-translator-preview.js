import { sanitizeHTML } from '../utils/sanitizer.js';
import { getImage } from '../utils/db-storage.js';
import { drafts, currentDraftId } from '../drafts/draft-manager.js';
import { formatPreviewDate } from '../utils/date-utils.js';

/**
 * Cache for blob URLs to avoid redundant ObjectURL creations.
 */
const blobCache = new Map();

/**
 * Updates the HTML preview for a translation.
 * @param {HTMLTextAreaElement} textarea - The markdown source.
 * @param {HTMLElement} preview - The preview container.
 */
export async function updatePreview(textarea, preview) {
  const details = textarea.closest('details');
  const title = details?.querySelector('.translation-title')?.value || '';
  const tagsStr =
    details?.querySelector('.translation-tags-hidden')?.value || '';
  const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : [];

  let content = textarea.value;

  const dateInput = document.querySelector('#post-date');
  const dateValue = dateInput ? dateInput.value : '';
  const dateHtml = dateValue
    ? `<time datetime="${dateValue}">${formatPreviewDate(dateValue)}</time>`
    : '';

  const tagsHtml = tags
    .map((t) => `<li><a href="#" class="post-tag">${t}</a></li>`)
    .join('');
  const titleHtml = title ? `<h1>${title}</h1>` : '';
  const metadataHtml =
    dateHtml || tagsHtml
      ? `<ul class="post-metadata"><li>${dateHtml}</li>${tagsHtml}</ul>`
      : '';

  const draft = drafts.find((d) => d.id === currentDraftId);
  if (draft && draft.imageFiles) {
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
  await sanitizeHTML(
    preview,
    `${titleHtml}${metadataHtml}${marked.parse(content)}`,
  );
}
