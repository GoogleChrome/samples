import {
  saveBackendConfigs,
  updateBackendFields,
  updateGlobalConfig,
} from '../ai/ai-config.js';
import { refreshAIVisibility, updateUIFields } from '../ai/ai-toggle.js';
import { aiKeys } from '../ai/ai-constants.js';
import { customAlert } from '../utils/dialog-utils.js';

/**
 * Applies a settings object to the application state (LocalStorage and UI).
 * @param {Object} settings - The settings object.
 * @param {Object} ui - The UI elements.
 * @return {Promise<void>}
 */
export async function applySettings(settings, ui) {
  if (settings['gh-config']) {
    localStorage.setItem('gh-config', JSON.stringify(settings['gh-config']));
    ['gh-token', 'gh-owner', 'gh-repo'].forEach((id) => {
      const key = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Input';
      if (ui[key] && settings['gh-config'][id] !== undefined) {
        ui[key].value = settings['gh-config'][id];
      }
    });
  }

  const toggles = {
    'ai-features-enabled': 'aiFeaturesToggle',
    'ai-only-existing-tags': 'aiOnlyExistingTagsToggle',
  };
  Object.entries(toggles).forEach(([key, uiKey]) => {
    if (settings[key] !== undefined) {
      localStorage.setItem(key, settings[key]);
      ui[uiKey].checked = settings[key];
    }
  });

  if (settings['ai-backend'] !== undefined) {
    localStorage.setItem('ai-backend', settings['ai-backend']);
    ui.aiBackendSelect.value = settings['ai-backend'];
  }

  if (settings['ai-backend-configs']) {
    saveBackendConfigs(settings['ai-backend-configs']);
    updateUIFields(ui, settings['ai-backend-configs'], aiKeys);
  }

  updateBackendFields(ui);
  refreshAIVisibility(ui);
  updateGlobalConfig(ui);

  if (ui.aiFeaturesToggle.checked) {
    const { initAIFeatures } = await import('../ai/ai-init.js');
    const { sync } = await import('./create-post.js');
    const { renderPills } = await import('./tag-editor.js');
    await initAIFeatures(ui, sync, { renderPills });
    window.dispatchEvent(
      new CustomEvent('ai-features-toggled', { detail: true }),
    );
  }
}
