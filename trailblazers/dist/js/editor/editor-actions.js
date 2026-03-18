import { performHousekeeping, drafts } from '../drafts/draft-manager.js';
import { downloadZIP } from '../export/zip-exporter.js';
import { generateMarkdown } from '../utils/markdown-utils.js';
import { createPR } from '../github/github-integration.js';
import { customAlert } from '../utils/dialog-utils.js';

/**
 * Initializes editor actions like copy, download, and GitHub PR creation.
 * @param {Object} ui - The UI elements.
 */
export function initEditorActions(ui) {
  ui.copyBtn.onclick = () => {
    const id = localStorage.getItem('current-draft-id');
    const d = drafts.find((draft) => draft.id === id);
    if (!d) {
      customAlert(ui, 'Please select or create a draft first.');
      return;
    }
    const classifierResults = window.getSelectedClassifierResults
      ? window.getSelectedClassifierResults()
      : [];
    const md = generateMarkdown(
      d,
      ui.titleInput.value,
      ui.descInput.value,
      ui.dateInput.value,
      ui.tagsInput.value,
      ui.contentInput.value,
      classifierResults,
    );
    navigator.clipboard
      .writeText(md)
      .then(() => {
        const oldText = ui.copyBtn.textContent;
        ui.copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
          ui.copyBtn.textContent = oldText;
        }, 2000);
      })
      .catch(() => {
        customAlert(ui, 'Failed to copy to clipboard.');
      });
  };

  ui.downloadBtn.onclick = async () => {
    await performHousekeeping();
    const id = localStorage.getItem('current-draft-id');
    const d = drafts.find((draft) => draft.id === id);
    if (!d) {
      customAlert(ui, 'Please select or create a draft first.');
      return;
    }
    const { ensureAllTranslationsReady } =
      await import('../ai/ai-translator.js');
    const { sync } = await import('./create-post.js');
    await ensureAllTranslationsReady(ui, sync);

    const classifierResults = window.getSelectedClassifierResults
      ? window.getSelectedClassifierResults()
      : [];
    await downloadZIP(
      d,
      ui.titleInput.value,
      ui.descInput.value,
      ui.dateInput.value,
      ui.tagsInput.value,
      ui.contentInput.value,
      classifierResults,
    );
  };

  ui.githubPrBtn.onclick = async () => {
    await performHousekeeping();
    const id = localStorage.getItem('current-draft-id');
    const d = drafts.find((draft) => draft.id === id);
    if (!d) {
      customAlert(ui, 'Please select or create a draft first.');
      return;
    }
    createPR(ui, d);
  };
}
