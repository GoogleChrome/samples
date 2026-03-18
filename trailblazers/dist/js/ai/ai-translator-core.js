import { detectLanguage } from './ai-language-detection.js';
import { customAlert, customConfirm } from '../utils/dialog-utils.js';
import { runAIAction } from './ai-features.js';
import { updatePreview } from './ai-translator-preview.js';
import { drafts, currentDraftId } from '../drafts/draft-manager.js';
import { generateMarkdown } from '../utils/markdown-utils.js';
import {
  getSupportedLocales,
  getTranslatorOptions,
  translateMediaAttributes,
  translateMetadata,
  translateBlocks,
} from './ai-translator-utils.js';

/**
 * Runs the translation for a specific locale.
 * @param {Object} ui - The UI elements.
 * @param {string} targetLocale - The target locale.
 * @param {HTMLElement} details - The <details> element.
 * @param {Function} updateCallback - Callback for UI updates.
 */
export async function runTranslation(
  ui,
  targetLocale,
  details,
  updateCallback,
) {
  let sourceText = ui.contentInput.value;
  let isSelection = false;

  const selectionStart = ui.contentInput.selectionStart;
  const selectionEnd = ui.contentInput.selectionEnd;
  const selectedText = sourceText
    .substring(selectionStart, selectionEnd)
    .trim();

  if (selectedText) {
    sourceText = selectedText;
    isSelection = true;
  }

  if (!sourceText && !ui.titleInput.value) {
    return customAlert(ui, 'Please write some content or a title first.');
  }

  const titleInput = details.querySelector('.translation-title');
  const descInput = details.querySelector('.translation-description');
  const tagsHidden = details.querySelector('.translation-tags-hidden');
  const textarea = details.querySelector('.translation-markdown');
  const preview = details.querySelector('.translation-preview');
  const btn = details.querySelector('.translate-btn');

  const isNative = Translator.toString().includes('[native code]');

  await runAIAction(
    ui,
    btn,
    async () => {
      const sourceLocale = await detectLanguage(sourceText);
      const options = getTranslatorOptions(ui, sourceLocale, targetLocale);
      const status = await Translator.availability(options);

      if (status === 'unavailable') {
        return customAlert(
          ui,
          `Translator unavailable from ${sourceLocale} to ${targetLocale}`,
        );
      }

      const translator = await Translator.create(options);

      // 1. Translate Metadata (Title, Description, Tags)
      const metadata = await translateMetadata(translator, {
        title: ui.titleInput.value.trim(),
        description: ui.descInput.value.trim(),
        tagsValue: ui.tagsInput.value.trim(),
      });
      if (metadata.title) titleInput.value = metadata.title;
      if (metadata.description) descInput.value = metadata.description;
      if (metadata.tags) {
        tagsHidden.value = metadata.tags;
        details._tagEditor?.renderPills();
      }

      // 2. Translate Content
      const blocks = sourceText.split(/\n\s*\n/);
      const translatedContent = await translateBlocks(translator, blocks);

      if (isSelection) {
        let mode = 'append';
        if (textarea.value.trim()) {
          const choice = await customConfirm(
            ui,
            'You already have a translation. Should the AI replace it or append at the end?',
            { confirmText: 'Append', cancelText: 'Replace' },
          );
          if (choice === 'cancel') mode = 'replace';
          else if (choice !== 'confirm') return;
        }

        if (mode === 'replace') {
          textarea.value = translatedContent.trim();
        } else {
          textarea.value =
            textarea.value.replace(/\n+$/, '') +
            '\n\n' +
            translatedContent.trim();
        }
      }

      // 5. Finalize content (store body only in UI)
      if (!isSelection) {
        textarea.value = translatedContent.trim();
      }

      textarea.style.display = 'block';
      await updatePreview(textarea, preview);
    },
    updateCallback,
    isNative,
  );
}

/**
 * Ensures all enabled locales have translations.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback for UI updates.
 * @return {Promise<void>}
 */
export async function ensureAllTranslationsReady(ui, updateCallback) {
  const enabledLocales = Array.from(
    ui.aiTranslationLocalesContainer.querySelectorAll(
      '.ai-locale-toggle:checked',
    ),
  ).map((cb) => cb.getAttribute('data-locale'));

  if (!ui.aiTranslateToggle.checked || enabledLocales.length === 0) {
    return;
  }

  const promises = enabledLocales.map(async (locale) => {
    const details = ui.aiTranslationsContainer.querySelector(
      `details[data-locale="${locale}"]`,
    );
    if (details) {
      const textarea = details.querySelector('.translation-markdown');
      if (textarea && !textarea.value.trim()) {
        await runTranslation(ui, locale, details, updateCallback);
      }
    }
  });

  await Promise.all(promises);
  updateCallback();
}
