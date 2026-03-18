import { deleteImagesForDraft } from '../utils/db-storage.js';
import { customConfirm } from '../utils/dialog-utils.js';
import { performHousekeeping as h_performHousekeeping } from './draft-housekeeping.js';
import { updateDraftTranslations } from './draft-utils.js';

/** @type {Array<Object>} */
export let drafts = JSON.parse(localStorage.getItem('blog-drafts') || '[]');
/** @type {string|null} */
export let currentDraftId = localStorage.getItem('current-draft-id');

/**
 * Sets the current draft ID and persists it to localStorage.
 * @param {string} id - The draft identifier.
 */
export function setCurrentDraftId(id) {
  currentDraftId = id;
  localStorage.setItem('current-draft-id', id);
}

/**
 * Saves the drafts array to localStorage.
 */
export function saveDrafts() {
  localStorage.setItem('blog-drafts', JSON.stringify(drafts));
}

/**
 * Saves the current draft data by updating the drafts array.
 * @param {string} id - The draft identifier.
 * @param {Object} ui - The UI elements containing draft data.
 */
export function saveCurrentDraft(id, ui) {
  updateDraftData(id, ui);
}

/**
 * Creates a new draft, adds it to the list, and loads it.
 * @param {Object} ui - The UI elements.
 * @param {Function} loadDraftFn - Function to load a draft by ID.
 * @param {Function} renderListFn - Function to render the drafts list.
 */
export async function createNewDraft(ui, loadDraftFn, renderListFn) {
  const id = Date.now().toString();
  const newDraft = {
    id,
    title: '',
    description: '',
    date: '',
    tags: '',
    content: '',
    imageFiles: [],
    lastModified: Date.now(),
  };
  drafts.unshift(newDraft);
  setCurrentDraftId(id);
  saveDrafts();
  await loadDraftFn(id);
  renderListFn();
}

/**
 * Performs housekeeping on the drafts array.
 */
export async function performHousekeeping() {
  await h_performHousekeeping(drafts, saveDrafts);
}

/**
 * Deletes a draft after user confirmation.
 * @param {string} id - The draft identifier.
 * @param {Object} ui - The UI elements.
 * @param {Function} createNewDraftFn - Function to create a new draft.
 * @param {Function} loadDraftFn - Function to load a draft.
 * @param {Function} renderListFn - Function to render the list.
 */
export async function deleteDraft(
  id,
  ui,
  createNewDraftFn,
  loadDraftFn,
  renderListFn,
) {
  const confirmed = await customConfirm(
    ui,
    'Are you sure you want to delete this draft?',
    { confirmText: 'Delete', confirmClass: 'btn btn-danger' },
  );
  if (!confirmed) {
    return;
  }
  await deleteImagesForDraft(id);
  drafts = drafts.filter((d) => d.id !== id);
  saveDrafts();

  // Comprehensive cleanup
  await performHousekeeping();

  if (currentDraftId === id) {
    if (drafts.length > 0) {
      loadDraftFn(drafts[0].id);
    } else {
      createNewDraftFn();
    }
  } else {
    renderListFn();
  }
}

/**
 * Updates the data of a specific draft from the UI.
 * @param {string} id - The draft identifier.
 * @param {Object} ui - The UI elements.
 */
export function updateDraftData(id, ui) {
  const draft = drafts.find((d) => d.id === id);
  if (!draft) {
    return;
  }
  draft.title = ui.titleInput.value;
  draft.description = ui.descInput.value;
  draft.date = ui.dateInput.value;
  draft.tags = ui.tagsInput.value;
  draft.content = ui.contentInput.value;

  // Get classifier results from UI if possible
  if (window.getSelectedClassifierResults) {
    draft.classifierResults = window.getSelectedClassifierResults();
  }

  // Get translations from UI
  updateDraftTranslations(draft, ui);

  draft.lastModified = Date.now();
  saveDrafts();
}
