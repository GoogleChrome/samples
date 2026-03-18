import { drafts } from '../drafts/draft-manager.js';

/**
 * Renders the list of drafts in the UI.
 * @param {Object} ui - The UI elements.
 * @param {Function} loadDraft - Function to load a specific draft.
 */
export function renderList(ui, loadDraft) {
  ui.draftsListEl.innerHTML = '';
  const currentId = localStorage.getItem('current-draft-id');
  drafts.forEach((d) => {
    const li = document.createElement('li');
    if (d.id === currentId) {
      li.classList.add('active');
    }
    li.onclick = () => {
      loadDraft(d.id);
    };
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'current-draft';
    radio.checked = d.id === currentId;
    const title = document.createElement('span');
    title.className = 'draft-title';
    title.textContent = d.title || 'Untitled Draft';
    const del = document.createElement('button');
    del.className = 'delete-draft-btn';
    del.textContent = '🗑️';
    del.onclick = async (e) => {
      e.stopPropagation();
      const { deleteDraft, createNewDraft } =
        await import('../drafts/draft-manager.js');
      deleteDraft(
        d.id,
        ui,
        () => createNewDraft(ui, loadDraft, () => renderList(ui, loadDraft)),
        loadDraft,
        () => renderList(ui, loadDraft),
      );
    };
    li.append(radio, title, del);
    ui.draftsListEl.appendChild(li);
  });
}
