import { customAlert } from '../utils/dialog-utils.js';
import { refreshAIVisibility } from './ai-toggle.js';
import { drafts, currentDraftId } from '../drafts/draft-manager.js';
import {
  restoreTranslations,
  refreshAITranslationUI,
} from './ai-translator-ui.js';
import { runTranslation } from './ai-translator-core.js';
import { getSupportedLocales } from './ai-translator-utils.js';

export { ensureAllTranslationsReady } from './ai-translator-core.js';

/**
 * Initializes the AI Translator feature.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback for UI updates.
 * @return {Promise<void>}
 */
export async function initAITranslator(ui, updateCallback) {
  if (
    !('Translator' in self) ||
    (await self.Translator.availability({
      sourceLanguage: 'en',
      targetLanguage: 'es',
    }).catch(() => 'unavailable')) === 'unavailable'
  ) {
    await import('/js/task-apis/translator.js');
  }

  // Restore state
  ui.aiTranslateToggle.checked =
    localStorage.getItem('ai-translate-enabled') === 'true';
  ui.aiTranslationLocalesContainer.style.display = ui.aiTranslateToggle.checked
    ? 'block'
    : 'none';

  const savedLocales = JSON.parse(
    localStorage.getItem('ai-translate-locales') || '[]',
  );

  // Populate locale checkboxes dynamically
  ui.aiTranslationLocalesContainer.innerHTML = '';
  getSupportedLocales().forEach((locale) => {
    const label = document.createElement('label');
    label.className = 'ai-toggle-label';
    label.style.display = 'block';
    label.style.marginTop = '0.5rem';

    const displayName = new Intl.DisplayNames(['en'], { type: 'language' }).of(
      locale,
    );
    const checked = savedLocales.includes(locale) ? 'checked' : '';
    label.innerHTML = `
      ${displayName} (${locale})
      <input type="checkbox" switch data-locale="${locale}" class="ai-locale-toggle" ${checked}>
    `;
    ui.aiTranslationLocalesContainer.appendChild(label);
  });

  ui.aiTranslateToggle.onchange = () => {
    localStorage.setItem('ai-translate-enabled', ui.aiTranslateToggle.checked);
    ui.aiTranslationLocalesContainer.style.display = ui.aiTranslateToggle
      .checked
      ? 'block'
      : 'none';
    refreshAITranslationUI(ui, updateCallback);
  };

  ui.aiTranslationLocalesContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('ai-locale-toggle')) {
      const enabledLocales = Array.from(
        ui.aiTranslationLocalesContainer.querySelectorAll(
          '.ai-locale-toggle:checked',
        ),
      ).map((cb) => cb.getAttribute('data-locale'));
      localStorage.setItem(
        'ai-translate-locales',
        JSON.stringify(enabledLocales),
      );
      refreshAITranslationUI(ui, updateCallback);
    }
  });

  if (typeof Translator !== 'undefined') {
    ui.aiTranslationSection.setAttribute('data-ai-available', 'true');
    if (ui.aiTranslateAllBtn) {
      ui.aiTranslateAllBtn.setAttribute('data-ai-available', 'true');
      ui.aiTranslateAllBtn.onclick = () => {
        const enabledLocales = Array.from(
          ui.aiTranslationLocalesContainer.querySelectorAll(
            '.ai-locale-toggle:checked',
          ),
        ).map((cb) => cb.getAttribute('data-locale'));

        if (enabledLocales.length === 0) {
          customAlert(
            ui,
            'Please enable at least one locale translation in Settings.',
          );
          return;
        }

        enabledLocales.forEach((locale) => {
          const details = ui.aiTranslationsContainer.querySelector(
            `details[data-locale="${locale}"]`,
          );
          const btn = details?.querySelector('.translate-btn');
          if (btn) btn.click();
        });
      };
    }
    refreshAIVisibility(ui);
  }

  // Initial UI refresh based on restored state
  refreshAITranslationUI(ui, updateCallback);

  // Restore translations from the current draft if any
  const draft = drafts.find((d) => d.id === currentDraftId);
  if (draft && draft.translations) {
    restoreTranslations(ui, draft.translations, updateCallback);
  }

  // Global access for draft restoration
  window.restoreTranslations = (translations) =>
    restoreTranslations(ui, translations, updateCallback);
}
