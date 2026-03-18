import {
  drafts,
  createNewDraft,
  saveDrafts,
  setCurrentDraftId,
  performHousekeeping,
} from '../drafts/draft-manager.js';
import {
  initGitHubSync,
  loadPostFromGitHub,
} from '../github/github-integration.js';
import { base64ToBuffer } from '../utils/base64-utils.js';
import { saveImage } from '../utils/db-storage.js';
import { customAlert } from '../utils/dialog-utils.js';
import { initAIToggle } from '../ai/ai-toggle.js';
import { initSettingsFileHandler } from './settings-file-handler.js';
import { initAITranslator } from '../ai/ai-translator.js';

/**
 * Initializes the editor, handles loading posts from GitHub if an 'edit' parameter is present,
 * and sets up essential UI features like AI and settings file handling.
 * @param {Object} ui - The UI elements.
 * @param {Function} loadDraft - Function to load a draft.
 * @param {Function} renderList - Function to render the draft list.
 * @param {Function} sync - Function to sync editor content.
 * @param {Object} tagEditor - The tag editor component instance.
 */
export async function initEditor(ui, loadDraft, renderList, sync, tagEditor) {
  initGitHubSync(ui);

  const editPath = new URLSearchParams(window.location.search).get('edit');
  if (editPath) {
    try {
      const postData = await loadPostFromGitHub(ui, editPath);
      const existingDraft = drafts.find((d) => d.path === postData.path);
      const id = existingDraft ? existingDraft.id : Date.now().toString();

      const imageFiles = [];
      for (const img of postData.images || []) {
        const buffer = base64ToBuffer(img.content);
        const imgId = `${id}:${Date.now()}:${img.name}`;
        await saveImage(imgId, buffer);
        imageFiles.push({
          name: img.name,
          id: imgId,
          type: `image/${img.name.split('.').pop()}`,
          sha: img.sha,
          path: img.path,
        });
      }

      const draftToUpdate = existingDraft || { id };
      Object.assign(draftToUpdate, {
        title: postData.title || '',
        description: postData.description || '',
        date: postData.date || '',
        tags: postData.tags || '',
        content: postData.content || '',
        ad_categories: postData.ad_categories,
        ad_confidences: postData.ad_confidences,
        imageFiles,
        path: postData.path,
        sha: postData.sha,
        lastModified: Date.now(),
      });

      if (!existingDraft) {
        drafts.unshift(draftToUpdate);
      }
      setCurrentDraftId(id);
      saveDrafts();

      const url = new URL(window.location);
      url.searchParams.delete('edit');
      window.history.replaceState({}, '', url);
    } catch (e) {
      console.error(e);
      if (e.message.includes('fill in GitHub settings')) {
        ui.settingsDetails.open = true;
        ui.ghTokenInput.focus();
      } else {
        customAlert(ui, `Failed to load post: ${e.message}`);
      }
    }
  }

  if (drafts.length === 0) {
    await createNewDraft(ui, loadDraft, renderList);
  } else {
    await loadDraft(localStorage.getItem('current-draft-id') || drafts[0].id);
  }

  initAIToggle(ui);
  initSettingsFileHandler(ui);
  await initAITranslator(ui, sync);
  if (ui.aiFeaturesToggle.checked) {
    const { initAIFeatures } = await import('../ai/ai-init.js');
    await initAIFeatures(ui, sync, tagEditor);
  }
  await performHousekeeping();
}
