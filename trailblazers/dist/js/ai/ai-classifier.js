import { updateDraftData } from '../drafts/draft-manager.js';
import { customAlert } from '../utils/dialog-utils.js';
import { getMonitor, runAIAction } from './ai-features.js';
import { refreshAIVisibility } from './ai-toggle.js';
import {
  renderClassifierResults,
  updateScriptTagInContent,
} from './ai-classifier-renderer.js';
import { restoreClassifierResults } from './ai-classifier-restorer.js';

/**
 * Initializes the AI Classifier feature.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback for UI updates.
 * @return {Promise<void>}
 */
export async function initAIClassifier(ui, updateCallback) {
  if (!ui.aiClassifierBtn) {
    return;
  }
  if (
    !('Classifier' in self) ||
    (await self.Classifier.availability().catch(() => 'unavailable')) ===
      'unavailable'
  ) {
    try {
      await import('/js/task-apis/classifier.js');
    } catch (e) {
      console.error('Failed to load Classifier polyfill', e);
      return;
    }
  }
  const ClassifierClass = self.Classifier;

  await restoreClassifierResults(ui, updateCallback);

  if (ClassifierClass) {
    try {
      const status = await ClassifierClass.availability();
      if (status !== 'unavailable') {
        ui.aiClassifierSection?.setAttribute('data-ai-available', 'true');
        ui.aiClassifierBtn?.setAttribute('data-ai-available', 'true');
        refreshAIVisibility(ui);
      } else {
        ui.aiClassifierSection?.setAttribute('data-ai-available', 'true');
        ui.aiClassifierBtn?.setAttribute('data-ai-available', 'true');
        refreshAIVisibility(ui);
      }
    } catch (e) {
      console.warn('AI Classifier availability check failed', e);
      ui.aiClassifierSection?.setAttribute('data-ai-available', 'true');
      ui.aiClassifierBtn?.setAttribute('data-ai-available', 'true');
      refreshAIVisibility(ui);
    }
  }

  window.addEventListener('classifier-updated', () => {
    const id = localStorage.getItem('current-draft-id');
    if (id) {
      updateDraftData(id, ui);
      updateScriptTagInContent(ui);
    }
  });

  ui.aiClassifierBtn.onclick = async () => {
    const title = ui.titleInput.value.trim();
    const content = ui.contentInput.value.trim();
    if (!title && !content) {
      return customAlert(ui, 'Please provide a title or content first.');
    }

    const input = `Title: ${title}\n\nContent: ${content}`;
    const isNative = ClassifierClass.toString().includes('[native code]');

    await runAIAction(
      ui,
      ui.aiClassifierBtn,
      async () => {
        const status = await ClassifierClass.availability();
        if (status === 'unavailable') {
          return customAlert(ui, 'Classifier unavailable.');
        }

        ui.aiClassifierResults.innerHTML = 'Classifying...';
        const monitor = getMonitor(ui, 'en', 'Classifier');
        const classifier = await ClassifierClass.create({ ...monitor });
        const results = await classifier.classify(input);

        if (results && results.length > 0) {
          const filteredResults = results.filter((res) => res.id !== 'unknown');
          if (filteredResults.length === 0) {
            ui.aiClassifierResults.innerHTML = 'No categories found.';
            return;
          }
          await renderClassifierResults(ui, filteredResults, updateCallback);
          window.dispatchEvent(new CustomEvent('classifier-updated'));
        } else {
          ui.aiClassifierResults.innerHTML = 'No categories found.';
        }
      },
      updateCallback,
      isNative,
    );
  };
}
