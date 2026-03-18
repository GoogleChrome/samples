import { fileOpen } from 'browser-fs-access';
import { parseFrontmatter } from '../editor/frontmatter-parser.js';
import { drafts, saveDrafts, setCurrentDraftId } from './draft-manager.js';
import { saveImage } from '../utils/db-storage.js';
import { customAlert } from '../utils/dialog-utils.js';

/**
 * Opens a file picker to load a draft from a .md or .zip file.
 * @param {Object} ui - The UI elements.
 * @param {Function} loadDraftFn - Function to load a draft.
 * @param {Function} renderListFn - Function to render the drafts list.
 * @return {Promise<void>}
 */
export async function openAndLoadDraft(ui, loadDraftFn, renderListFn) {
  try {
    const blob = await fileOpen({
      mimeTypes: ['text/markdown', 'application/zip'],
      extensions: ['.md', '.zip'],
      description: 'Blog Drafts',
    });
    await handleLoadDraft(blob, ui, loadDraftFn, renderListFn);
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      customAlert(ui, 'Failed to open file.');
    }
  }
}

/**
 * Internal handler for loading a draft from a File/Blob.
 * @param {File|Blob} file - The draft file.
 * @param {Object} ui - The UI elements.
 * @param {Function} loadDraftFn - Function to load a draft.
 * @param {Function} renderListFn - Function to render the drafts list.
 */
async function handleLoadDraft(file, ui, loadDraftFn, renderListFn) {
  if (file.name.endsWith('.md')) {
    const text = await file.text();
    const { metadata, content } = parseFrontmatter(text);
    const id = Date.now().toString();
    const newDraft = {
      id,
      title: metadata.title || '',
      description: metadata.description || '',
      date: metadata.date || '',
      tags: Array.isArray(metadata.tags)
        ? metadata.tags.join(', ')
        : metadata.tags || '',
      ad_categories: metadata.ad_categories,
      ad_confidences: metadata.ad_confidences,
      content: content || '',
      imageFiles: [],
      lastModified: Date.now(),
    };
    drafts.unshift(newDraft);
    setCurrentDraftId(id);
    saveDrafts();
    await loadDraftFn(id);
    renderListFn();
  } else if (file.name.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(file);
    const mdFile = Object.values(zip.files).find((f) => f.name.endsWith('.md'));
    if (!mdFile) {
      customAlert(ui, 'No .md file found in the ZIP archive.');
      return;
    }

    const text = await mdFile.async('text');
    const { metadata, content } = parseFrontmatter(text);
    const id = Date.now().toString();
    const newDraft = {
      id,
      title: metadata.title || '',
      description: metadata.description || '',
      date: metadata.date || '',
      tags: Array.isArray(metadata.tags)
        ? metadata.tags.join(', ')
        : metadata.tags || '',
      ad_categories: metadata.ad_categories,
      ad_confidences: metadata.ad_confidences,
      content: content || '',
      imageFiles: [],
      lastModified: Date.now(),
    };

    // Extract images
    for (const [filename, zipEntry] of Object.entries(zip.files)) {
      if (zipEntry.dir || filename === mdFile.name) {
        continue;
      }

      // Basic image extension check
      if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(filename)) {
        const buffer = await zipEntry.async('arrayBuffer');
        const simpleName = filename.split('/').pop();
        const imageId = `${id}:${Date.now()}:${simpleName}`;
        const type =
          `image/${simpleName.split('.').pop().toLowerCase()}`.replace(
            'jpg',
            'jpeg',
          );

        await saveImage(imageId, buffer);
        newDraft.imageFiles.push({ name: simpleName, id: imageId, type });
      }
    }

    drafts.unshift(newDraft);
    setCurrentDraftId(id);
    saveDrafts();
    await loadDraftFn(id);
    renderListFn();
  }
}
