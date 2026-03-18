import { handleFiles } from './image-handler.js';
import {
  parseFrontmatter,
  populateUIFromMetadata,
} from './frontmatter-parser.js';
import { handleHtmlPaste } from './html-paste-handler.js';

/**
 * Initializes the paste handler for the content input and global drag-and-drop events.
 * @param {Object} ui - The UI elements.
 * @param {Object[]} drafts - The list of drafts.
 * @param {Object} tagEditor - The tag editor component instance.
 * @param {Function} sync - Function to sync editor content.
 */
export function initPasteHandler(ui, drafts, tagEditor, sync) {
  ui.contentInput.onpaste = async (e) => {
    if (e.clipboardData.files?.length > 0) {
      e.preventDefault();
      return handleFiles(
        e.clipboardData.files,
        localStorage.getItem('current-draft-id'),
        drafts,
        ui,
        sync,
      );
    }
    if (await handleHtmlPaste(e, ui, drafts, sync)) {
      return;
    }

    const { metadata, content } = parseFrontmatter(
      e.clipboardData.getData('text'),
    );
    if (metadata && Object.keys(metadata).length > 0) {
      e.preventDefault();
      await populateUIFromMetadata(metadata, ui, tagEditor);
      ui.contentInput.value = content;
      sync();
    }
  };

  let dragCounter = 0;
  window.addEventListener('dragenter', (e) => {
    if (
      ui.dropZone.getAttribute('data-disabled') !== 'true' &&
      e.dataTransfer.types.includes('Files')
    ) {
      dragCounter++;
      ui.dropZone.classList.add('dragover');
    }
  });
  window.addEventListener('dragleave', () => {
    if (ui.dropZone.getAttribute('data-disabled') !== 'true') {
      dragCounter = Math.max(0, dragCounter - 1);
      if (dragCounter === 0) {
        ui.dropZone.classList.remove('dragover');
      }
    }
  });
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  window.addEventListener('drop', (e) => {
    if (ui.dropZone.getAttribute('data-disabled') === 'true') {
      return;
    }
    e.preventDefault();
    dragCounter = 0;
    ui.dropZone.classList.remove('dragover');
    if (e.dataTransfer.files?.length > 0) {
      handleFiles(
        e.dataTransfer.files,
        localStorage.getItem('current-draft-id'),
        drafts,
        ui,
        sync,
      );
    }
  });
}
