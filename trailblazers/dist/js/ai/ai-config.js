import { customAlert } from '../utils/dialog-utils.js';
import { DEFAULT_CONFIGS } from './ai-constants.js';

export { aiKeys } from './ai-constants.js';

/**
 * Retrieves the current AI backend configurations from localStorage.
 * @return {Object} The backend configurations.
 */
export function getBackendConfigs() {
  return JSON.parse(
    localStorage.getItem('ai-backend-configs') ||
      JSON.stringify(DEFAULT_CONFIGS),
  );
}

/**
 * Saves AI backend configurations to localStorage.
 * @param {Object} configs - The configurations to save.
 */
export function saveBackendConfigs(configs) {
  localStorage.setItem('ai-backend-configs', JSON.stringify(configs));
}

/**
 * Checks if the necessary AI keys are configured for the selected backend.
 * @param {Object} ui - The UI elements.
 * @return {boolean} True if keys are configured or not needed, false otherwise.
 */
export function checkAIKeys(ui) {
  const backend = ui.aiBackendSelect.value;
  if (backend === 'transformers-js') {
    updateGlobalConfig(ui);
    return true;
  }

  const configs = getBackendConfigs();
  const apiKey = configs[backend]?.['ai-api-key'];

  if (!apiKey) {
    ui.settingsDetails.open = true;
    customAlert(
      ui,
      'Please enter your AI details in the Settings section to use AI features.',
    );
    return false;
  }
  updateGlobalConfig(ui);
  return true;
}

/**
 * Updates global configuration objects on the window based on the selected backend.
 * @param {Object} ui - The UI elements.
 */
export function updateGlobalConfig(ui) {
  const backend = ui.aiBackendSelect.value;
  [
    'FIREBASE_CONFIG',
    'TRANSFORMERS_CONFIG',
    'OPENAI_CONFIG',
    'GEMINI_CONFIG',
  ].forEach((k) => {
    delete window[k];
  });

  const configs = getBackendConfigs();
  const current = configs[backend] || {};
  const apiKey =
    current['ai-api-key'] || (backend === 'transformers-js' ? 'dummy' : '');
  const config = { apiKey, modelName: current['ai-model-name'] || '' };

  if (backend === 'firebase') {
    window.FIREBASE_CONFIG = {
      ...config,
      projectId: current['ai-project-id'],
      appId: current['ai-app-id'],
      geminiApiProvider: current['ai-gemini-api-provider'],
      useAppCheck: current['ai-use-app-check'],
      reCaptchaSiteKey: current['ai-recaptcha-site-key'],
      useLimitedUseAppCheckTokens: current['ai-use-limited-use-tokens'],
    };
  } else if (backend === 'transformers-js') {
    window.TRANSFORMERS_CONFIG = {
      ...config,
      device: current['ai-device'],
      dtype: current['ai-dtype'],
    };
  } else if (backend === 'openai') {
    window.OPENAI_CONFIG = config;
  } else if (backend === 'gemini-api') {
    window.GEMINI_CONFIG = config;
  }

  localStorage.setItem('prompt-api-backend', backend);
}

/**
 * Updates the visibility of backend-specific settings fields in the UI.
 * @param {Object} ui - The UI elements.
 */
export function updateBackendFields(ui) {
  const backend = ui.aiBackendSelect.value;
  document.querySelectorAll('.ai-backend-fields').forEach((el) => {
    const supported = el.getAttribute('data-backend').split(' ');
    el.style.display = supported.includes(backend) ? 'block' : 'none';
  });
  if (ui.aiAppCheckFields) {
    ui.aiAppCheckFields.style.display =
      backend === 'firebase' && ui.aiUseAppCheckToggle.checked
        ? 'block'
        : 'none';
  }
}
