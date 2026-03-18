import { saveImage } from '../utils/db-storage.js';
import { saveDrafts } from '../drafts/draft-manager.js';
import { wrapText } from './editor-logic.js';

/**
 * Processes an image file, generates metadata (using AI if enabled), saves it to DB, and updates the draft.
 * @param {File} file - The image file to process.
 * @param {string} currentId - The current draft ID.
 * @param {Object} draft - The draft object.
 * @param {Object} ui - The UI elements.
 * @return {Promise<Object>} Object containing image information (name, alt, caption, dimensions).
 */
export async function processImage(file, currentId, draft, ui) {
  const id = `${currentId}:${Date.now()}:${file.name}`;
  const buffer = await file.arrayBuffer();
  const dimensions = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: '', height: '' });
    };
    img.src = URL.createObjectURL(new Blob([buffer], { type: file.type }));
  });

  const isAiEnabled = localStorage.getItem('ai-features-enabled') === 'true';
  let aiMeta = null;
  if (isAiEnabled) {
    const { generateImageMetadata } = await import('../ai/ai-multimodal.js');
    aiMeta = await generateImageMetadata(
      new Blob([buffer], { type: file.type }),
      ui,
    );
  }
  const altText = aiMeta?.alt || 'Alt text here';
  const caption = aiMeta?.caption || 'Caption here';

  await saveImage(id, buffer);
  if (!draft.imageFiles) {
    draft.imageFiles = [];
  }
  draft.imageFiles.push({ name: file.name, id, type: file.type });
  saveDrafts();

  return {
    name: file.name,
    alt: altText,
    caption: caption,
    width: dimensions.width,
    height: dimensions.height,
  };
}

/**
 * Generates Markdown for a figure element containing an image.
 * @param {Object} imgInfo - Information about the image.
 * @param {boolean} needsNewlinesBefore - Whether to add newlines before the tag.
 * @param {boolean} needsNewlinesAfter - Whether to add newlines after the tag.
 * @return {string} The generated Markdown.
 */
export function getMarkdownForImage(
  imgInfo,
  needsNewlinesBefore = false,
  needsNewlinesAfter = false,
) {
  return `${needsNewlinesBefore ? '\n\n' : ''}<figure>
  <img
      src="./${imgInfo.name}"
      alt="${imgInfo.alt}"
      width="${imgInfo.width}" height="${imgInfo.height}" loading="lazy" decoding="async"
  >
  <figcaption>
    ${wrapText(imgInfo.caption, 80)}
  </figcaption>
</figure>${needsNewlinesAfter ? '\n\n' : '\n'}`;
}

/**
 * Handles multiple files (e.g., from an upload button or drop event).
 * @param {FileList} files - The list of files to process.
 * @param {string} currentId - The current draft ID.
 * @param {Object[]} drafts - The list of drafts.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback for UI updates.
 * @return {Promise<void>}
 */
export async function handleFiles(
  files,
  currentId,
  drafts,
  ui,
  updateCallback,
) {
  const draft = drafts.find((d) => d.id === currentId);
  if (!draft || !files.length) {
    return;
  }

  ui.uploadBtn.disabled = true;
  const oldBtnText = ui.uploadBtn.textContent;
  ui.uploadBtn.textContent = '⏳ Processing...';
  ui.dropZone.setAttribute('data-disabled', 'true');

  try {
    for (const file of files) {
      const start = ui.contentInput.selectionStart;
      const end = ui.contentInput.selectionEnd;
      const before = ui.contentInput.value.substring(0, start);
      const after = ui.contentInput.value.substring(end);
      const cleanBefore = before.replace(/\n+$/, '');
      const cleanAfter = after.replace(/^\n+/, '');

      const imgInfo = await processImage(file, currentId, draft, ui);
      const imgTag = getMarkdownForImage(
        imgInfo,
        cleanBefore.length > 0,
        cleanAfter.length > 0,
      );

      ui.contentInput.value = cleanBefore + imgTag + cleanAfter;
    }
  } finally {
    ui.uploadBtn.disabled = false;
    ui.uploadBtn.textContent = oldBtnText;
    ui.dropZone.removeAttribute('data-disabled');
  }
  updateCallback();
}
