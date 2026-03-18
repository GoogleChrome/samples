import { processImage, getMarkdownForImage } from './image-handler.js';

/**
 * Handles HTML content pasted into the editor, converting it to Markdown and processing images.
 * @param {ClipboardEvent} e - The paste event.
 * @param {Object} ui - The UI elements.
 * @param {Object[]} drafts - The list of drafts.
 * @param {Function} sync - Function to sync editor content.
 * @return {Promise<boolean>} True if HTML was handled, false otherwise.
 */
export async function handleHtmlPaste(e, ui, drafts, sync) {
  const html = e.clipboardData.getData('text/html');
  if (!html) {
    return false;
  }
  e.preventDefault();

  const id = localStorage.getItem('current-draft-id');
  const draft = drafts.find((d) => d.id === id);
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    bullet: '*',
  });

  turndownService.addRule('figureImages', {
    filter: 'img',
    replacement: (content, node) => {
      const src = node.getAttribute('src');
      const alt = node.getAttribute('alt') || '';
      if (src?.startsWith('__PASTED_IMG_')) {
        return src;
      }
      return `<figure>\n  <img src="${src}" alt="${alt}" loading="lazy" decoding="async">\n  <figcaption>\n    ${alt}\n  </figcaption>\n</figure>`;
    },
  });

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const imageMap = new Map();
  doc.querySelectorAll('img').forEach((img, i) => {
    const src = img.getAttribute('src');
    if (src) {
      const p = `__PASTED_IMG_${i}__`;
      imageMap.set(p, src);
      img.setAttribute('src', p);
    }
  });

  let markdown = turndownService.turndown(doc.body.innerHTML);
  const start = ui.contentInput.selectionStart;
  const end = ui.contentInput.selectionEnd;
  const val = ui.contentInput.value;
  const before = val.substring(0, start).replace(/\n+$/, '');
  const after = val.substring(end).replace(/^\n+/, '');

  let imgIdx = 0;
  for (const [p, src] of imageMap) {
    try {
      const resp = await fetch(src);
      const blob = await resp.blob();
      let name = src.split('/').pop().split('?')[0] || 'pasted-image.png';
      if (name === 'image.png' || !name.includes('.')) {
        name = `pasted-image-${Date.now()}-${imgIdx++}.png`;
      }
      const info = await processImage(
        new File([blob], name, { type: blob.type }),
        id,
        draft,
        ui,
      );
      markdown = markdown.replaceAll(
        p,
        getMarkdownForImage(info, false, false),
      );
    } catch (err) {
      markdown = markdown.replaceAll(
        p,
        `<figure>\n  <img src="${src}" alt="" loading="lazy" decoding="async">\n  <figcaption>Pasted Image</figcaption>\n</figure>`,
      );
    }
  }

  markdown = markdown.trim();
  ui.contentInput.value =
    before +
    (before.length > 0 ? '\n\n' : '') +
    markdown +
    (after.length > 0 ? '\n\n' : '') +
    after;
  sync();
  return true;
}
