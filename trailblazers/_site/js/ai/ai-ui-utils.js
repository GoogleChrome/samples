import { checkAIKeys } from './ai-config.js';
import { customAlert } from '../utils/dialog-utils.js';

/**
 * Creates a monitor for model download progress.
 * @param {Object} ui - The UI elements.
 * @param {string} lang - The language code.
 * @param {string} modelName - The name of the model being downloaded.
 * @return {Object} The monitor object.
 */
export const getMonitor = (ui, lang, modelName) => ({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      ui.aiStatus.style.display = 'flex';
      ui.aiDownloadProgress.value = e.loaded;
      ui.aiDownloadProgress.max = e.total;
      ui.aiStatusText.textContent = `Downloading ${modelName} (${lang}): ${Math.round((e.loaded / e.total) * 100)}%`;
      if (e.loaded === e.total) {
        setTimeout(() => {
          ui.aiStatus.style.display = 'none';
        }, 2000);
      }
    });
  },
});

/**
 * Executes an AI action with UI feedback (loading state).
 * @param {Object} ui - The UI elements.
 * @param {HTMLButtonElement} btn - The button that triggered the action.
 * @param {Function} actionFn - The asynchronous function containing the AI logic.
 * @param {Function} updateCallback - Callback for UI updates.
 * @param {boolean} [isNative=false] - Whether the action uses native AI support (bypasses credential check).
 * @return {Promise<void>}
 */
export async function runAIAction(
  ui,
  btn,
  actionFn,
  updateCallback,
  isNative = false,
) {
  if (!isNative && !checkAIKeys(ui)) {
    return;
  }
  btn.disabled = true;
  const oldText = btn.textContent;
  btn.textContent = '⏳';
  ui.activeAiStreams++;
  try {
    await actionFn();
  } catch (err) {
    console.error(err);
    customAlert(ui, 'AI Action failed.');
  } finally {
    ui.activeAiStreams--;
    btn.disabled = false;
    btn.textContent = oldText === '⏳' ? '✨' : oldText;
    if (typeof updateCallback === 'function') {
      updateCallback();
    }
  }
}

/**
 * Refreshes the visibility of AI features based on availability and enabled state.
 * @param {Object} ui - The UI elements.
 */
export function refreshAIVisibility(ui) {
  const aiEnabled = ui.aiFeaturesToggle.checked;
  const translateEnabled = ui.aiTranslateToggle.checked;
  const aiButtons = Array.from(document.querySelectorAll('.ai-button'));

  if (ui.aiWriterSection) {
    ui.aiWriterSection.style.display = aiEnabled ? 'block' : 'none';
  }
  if (ui.aiRewriterSection) {
    ui.aiRewriterSection.style.display = aiEnabled ? 'block' : 'none';
  }
  if (ui.aiClassifierSection) {
    ui.aiClassifierSection.style.display = aiEnabled ? 'block' : 'none';
  }
  if (ui.aiTranslationSection) {
    ui.aiTranslationSection.style.display = translateEnabled ? 'block' : 'none';
  }
  if (!aiEnabled && ui.aiStatus) {
    ui.aiStatus.style.display = 'none';
  }
  if (ui.aiKeysSection) {
    ui.aiKeysSection.style.display = aiEnabled ? 'block' : 'none';
  }

  aiButtons.forEach((btn) => {
    if (btn) {
      const isAvailable = btn.getAttribute('data-ai-available') === 'true';
      const isTranslateBtn =
        btn.classList.contains('translate-btn') ||
        btn.id === 'ai-translate-all-btn';
      const shouldShow =
        isAvailable && (isTranslateBtn ? translateEnabled : aiEnabled);
      btn.style.display = shouldShow ? 'flex' : 'none';
      if (btn.parentElement?.classList.contains('input-with-action')) {
        btn.parentElement.style.display = shouldShow ? 'flex' : 'block';
      }
    }
  });
}

/**
 * Synchronizes UI input fields with the current AI configuration.
 * @param {Object} ui - The UI elements.
 * @param {Object} configs - The AI configurations.
 * @param {string[]} aiKeys - The list of AI configuration keys.
 */
export function updateUIFields(ui, configs, aiKeys) {
  const currentBackend = ui.aiBackendSelect.value;
  const currentConfig = configs[currentBackend] || {};
  aiKeys.forEach((id) => {
    if (id === 'ai-backend') {
      return;
    }
    const key =
      id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) +
      (id.includes('toggle')
        ? ''
        : id.includes('provider') ||
            id.includes('backend') ||
            id.includes('device') ||
            id.includes('dtype')
          ? 'Select'
          : 'Input');
    const input = ui[key] || document.getElementById(id);
    if (input) {
      const val = currentConfig[id];
      if (input.type === 'checkbox') {
        input.checked = val === true;
      } else if (val !== undefined) {
        input.value = val;
      } else {
        input.value = '';
      }
    }
  });
}
