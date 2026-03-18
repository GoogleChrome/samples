import { runTranslation } from './ai-translator-core.js';
import { updatePreview } from './ai-translator-preview.js';
import { createTranslationDetails } from './ai-translator-details.js';

/**
 * Restores translations from draft data into the UI.
 * @param {Object} ui - The UI elements.
 * @param {Object} translations - The translations object from the draft.
 * @param {Function} updateCallback - Callback for UI updates.
 */
export function restoreTranslations(ui, translations, updateCallback) {
  if (!ui.aiTranslateToggle.checked) return;

  if (translations && Object.keys(translations).length > 0) {
    let hasNew = false;
    Object.entries(translations).forEach(([locale, data]) => {
      // Ensure the locale checkbox is checked
      const cb = ui.aiTranslationLocalesContainer.querySelector(
        `.ai-locale-toggle[data-locale="${locale}"]`,
      );
      if (cb && !cb.checked) {
        cb.checked = true;
        hasNew = true;
      }
    });

    if (hasNew) {
      const enabledLocales = Array.from(
        ui.aiTranslationLocalesContainer.querySelectorAll(
          '.ai-locale-toggle:checked',
        ),
      ).map((cb) => cb.getAttribute('data-locale'));
      localStorage.setItem(
        'ai-translate-locales',
        JSON.stringify(enabledLocales),
      );
    }
  }

  // Refresh UI to create details elements or sync with global settings
  refreshAITranslationUI(ui, updateCallback);

  // Clear all existing translation UI content before loading the new draft's content
  ui.aiTranslationsContainer.querySelectorAll('details').forEach((details) => {
    const textarea = details.querySelector('.translation-markdown');
    const preview = details.querySelector('.translation-preview');
    if (textarea) {
      textarea.value = '';
      textarea.style.display = 'none';
    }
    if (preview) {
      preview.innerHTML = '';
    }
  });

  // Fill in the content
  if (translations) {
    Object.entries(translations).forEach(([locale, data]) => {
      const details = ui.aiTranslationsContainer.querySelector(
        `details[data-locale="${locale}"]`,
      );
      if (details) {
        const textarea = details.querySelector('.translation-markdown');
        const preview = details.querySelector('.translation-preview');
        const titleInput = details.querySelector('.translation-title');
        const descInput = details.querySelector('.translation-description');
        const tagsInput = details.querySelector('.translation-tags-hidden');

        if (titleInput && data.title) titleInput.value = data.title;
        if (descInput && data.description) descInput.value = data.description;
        if (tagsInput && data.tags) {
          tagsInput.value = data.tags;
          details._tagEditor?.renderPills();
        }

        if (textarea && data.content) {
          textarea.value = data.content;
          textarea.style.display = 'block';
          updatePreview(textarea, preview);
        }
      }
    });
  }
}

/**
 * Refreshes the translation <details> elements based on enabled locales.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback for UI updates.
 */
export function refreshAITranslationUI(ui, updateCallback) {
  const enabledLocales = Array.from(
    ui.aiTranslationLocalesContainer.querySelectorAll(
      '.ai-locale-toggle:checked',
    ),
  ).map((cb) => cb.getAttribute('data-locale'));

  if (!ui.aiTranslateToggle.checked) {
    ui.aiTranslationSection.style.display = 'none';
    ui.aiTranslationsContainer.innerHTML = '';
    return;
  }

  ui.aiTranslationSection.style.display =
    enabledLocales.length > 0 ? 'block' : 'none';

  // Remove details for locales that were unchecked
  Array.from(ui.aiTranslationsContainer.querySelectorAll('details')).forEach(
    (details) => {
      const locale = details.getAttribute('data-locale');
      if (!enabledLocales.includes(locale)) {
        details.remove();
      }
    },
  );

  // Add details for new locales
  enabledLocales.forEach((locale) => {
    if (
      !ui.aiTranslationsContainer.querySelector(
        `details[data-locale="${locale}"]`,
      )
    ) {
      createTranslationDetails(ui, locale, updateCallback);
    }
  });
}
