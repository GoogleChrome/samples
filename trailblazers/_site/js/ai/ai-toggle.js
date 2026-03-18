import { refreshAIVisibility, updateUIFields } from './ai-ui-utils.js';
import { aiKeys } from './ai-constants.js';
import {
  updateGlobalConfig,
  updateBackendFields,
  getBackendConfigs,
  saveBackendConfigs,
} from './ai-config.js';

/**
 * Sets up listeners for AI-related input fields.
 * @param {Object} ui - The UI elements.
 * @param {Object} configs - The AI configurations.
 */
const setupAIFieldListeners = (ui, configs) => {
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
      input[input.type === 'checkbox' ? 'onchange' : 'oninput'] = () => {
        const currentBackend = ui.aiBackendSelect.value;
        if (!configs[currentBackend]) {
          configs[currentBackend] = {};
        }
        configs[currentBackend][id] =
          input.type === 'checkbox' ? input.checked : input.value;
        saveBackendConfigs(configs);
        updateGlobalConfig(ui);
        if (id === 'ai-use-app-check') {
          updateBackendFields(ui);
        }
        if (ui.aiFeaturesToggle.checked) {
          triggerAIInit(ui);
        }
      };
    }
  });
};

/**
 * Triggers the initialization of AI features.
 * @param {Object} ui - The UI elements.
 * @return {Promise<void>}
 */
const triggerAIInit = async (ui) => {
  const { initAIFeatures } = await import('./ai-init.js');
  const { sync } = await import('../editor/create-post.js');
  const { renderPills } = await import('../editor/tag-editor.js');
  await initAIFeatures(ui, sync, { renderPills });
};

/**
 * Initializes the AI toggle and related settings.
 * @param {Object} ui - The UI elements.
 */
export function initAIToggle(ui) {
  const configs = getBackendConfigs();
  ui.aiBackendSelect.value =
    localStorage.getItem('ai-backend') || ui.aiBackendSelect.value;
  updateUIFields(ui, configs, aiKeys);

  ui.aiBackendSelect.onchange = () => {
    localStorage.setItem('ai-backend', ui.aiBackendSelect.value);
    updateUIFields(ui, configs, aiKeys);
    updateBackendFields(ui);
    refreshAIVisibility(ui);
    updateGlobalConfig(ui);
  };

  setupAIFieldListeners(ui, configs);
  updateBackendFields(ui);
  updateGlobalConfig(ui);

  ui.aiFeaturesToggle.checked =
    localStorage.getItem('ai-features-enabled') === 'true';
  ui.aiOnlyExistingTagsToggle.checked =
    localStorage.getItem('ai-only-existing-tags') === 'true';
  refreshAIVisibility(ui);

  ui.aiFeaturesToggle.addEventListener('change', async () => {
    localStorage.setItem('ai-features-enabled', ui.aiFeaturesToggle.checked);
    if (ui.aiFeaturesToggle.checked) {
      await triggerAIInit(ui);
    }
    refreshAIVisibility(ui);
    window.dispatchEvent(
      new CustomEvent('ai-features-toggled', {
        detail: ui.aiFeaturesToggle.checked,
      }),
    );
  });

  ui.aiOnlyExistingTagsToggle.addEventListener('change', () => {
    localStorage.setItem(
      'ai-only-existing-tags',
      ui.aiOnlyExistingTagsToggle.checked,
    );
  });
}

export { refreshAIVisibility, updateUIFields };
