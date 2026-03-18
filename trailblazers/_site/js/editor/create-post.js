import { ui } from './ui-elements.js';
import { drafts, createNewDraft } from '../drafts/draft-manager.js';
import { updatePreview } from './editor-logic.js';
import { handleFiles } from './image-handler.js';
import { initPasteHandler } from './paste-handler.js';
import { initTagEditor } from './tag-editor.js';
import { debounce } from '../utils/debounce.js';
import { openAndLoadDraft } from '../drafts/load-draft.js';
import { initEditorActions } from './editor-actions.js';
import { initEditor } from './editor-init.js';
import { sync, renderList, loadDraft } from './editor-ui.js';

/**
 * Debounced version of updatePreview to prevent excessive re-renders.
 */
const debouncedPreview = debounce(
  (id, ui) => updatePreview(id, drafts, ui),
  300,
);

/**
 * Synchronizes the current draft data with the UI and updates the preview.
 */
const doSync = () =>
  sync(ui, debouncedPreview, () => renderList(ui, doLoadDraft));
window.sync = doSync;

/**
 * Loads a draft by ID and refreshes the draft list.
 * @param {string} id - The draft ID.
 */
const doLoadDraft = (id) =>
  loadDraft(id, ui, () => renderList(ui, doLoadDraft), tagEditor);

/**
 * The tag editor component instance.
 */
const tagEditor = initTagEditor(ui, doSync);

ui.titleInput.oninput = doSync;
ui.descInput.oninput = doSync;
ui.dateInput.oninput = doSync;
ui.contentInput.oninput = doSync;
window.addEventListener('classifier-updated', doSync);

ui.newDraftBtn.onclick = () =>
  createNewDraft(ui, doLoadDraft, () => renderList(ui, doLoadDraft));
ui.loadDraftBtn.onclick = () =>
  openAndLoadDraft(ui, doLoadDraft, () => renderList(ui, doLoadDraft));

initEditorActions(ui);
initPasteHandler(ui, drafts, tagEditor, doSync);

ui.uploadBtn.onclick = () => ui.fileInput.click();
ui.fileInput.onchange = () =>
  handleFiles(
    ui.fileInput.files,
    localStorage.getItem('current-draft-id'),
    drafts,
    ui,
    doSync,
  );

initEditor(
  ui,
  doLoadDraft,
  () => renderList(ui, doLoadDraft),
  doSync,
  tagEditor,
);

export { doLoadDraft as loadDraft, renderList, doSync as sync, tagEditor };
