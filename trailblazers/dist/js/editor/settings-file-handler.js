import { fileOpen, fileSave } from 'browser-fs-access';
import { customAlert } from '../utils/dialog-utils.js';
import { applySettings } from './settings-loader.js';

/**
 * Initializes the settings file handler, allowing users to save and load application settings.
 * @param {Object} ui - The UI elements.
 */
export function initSettingsFileHandler(ui) {
  ui.saveSettingsBtn.onclick = async () => {
    const settings = {
      'gh-config': JSON.parse(localStorage.getItem('gh-config') || '{}'),
      'ai-features-enabled':
        localStorage.getItem('ai-features-enabled') === 'true',
      'ai-only-existing-tags':
        localStorage.getItem('ai-only-existing-tags') === 'true',
      'ai-backend': localStorage.getItem('ai-backend'),
      'ai-backend-configs': JSON.parse(
        localStorage.getItem('ai-backend-configs') || '{}',
      ),
    };

    try {
      await fileSave(
        new Blob([JSON.stringify(settings, null, 2)], {
          type: 'application/json',
        }),
        {
          fileName: 'eleventy-blog-settings.json',
          extensions: ['.json'],
          description: 'Settings File',
        },
      );
    } catch (err) {
      if (err.name !== 'AbortError') {
        customAlert(ui, 'Failed to save settings: ' + err.message);
      }
    }
  };

  ui.loadSettingsBtn.onclick = async () => {
    try {
      const blob = await fileOpen({
        extensions: ['.json'],
        description: 'Settings File',
      });
      const settings = JSON.parse(await blob.text());
      await applySettings(settings, ui);
      customAlert(ui, 'Settings loaded successfully!');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        customAlert(ui, 'Failed to load settings: ' + err.message);
      }
    }
  };
}
