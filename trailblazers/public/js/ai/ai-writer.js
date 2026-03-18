import { detectLanguage } from './ai-language-detection.js';
import { customAlert, customConfirm } from '../utils/dialog-utils.js';
import { getMonitor, runAIAction } from './ai-features.js';
import { refreshAIVisibility } from './ai-toggle.js';

/**
 * Generates options for the AI Writer.
 * @param {Object} ui - The UI elements.
 * @param {string} lang - The language code.
 * @return {Object} The writer options.
 */
const getWriterOptions = (ui, lang) => ({
  sharedContext:
    'The user provides a few bullet points. Expand them into a detailed blog post.',
  expectedInputLanguages: [lang],
  outputLanguage: lang,
  ...getMonitor(ui, lang, 'Writer'),
});

/**
 * Initializes the AI Writer feature.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback for UI updates.
 * @return {Promise<void>}
 */
export async function initAIWriter(ui, updateCallback) {
  if (
    !('Writer' in self) ||
    (await self.Writer.availability({
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
    }).catch(() => 'unavailable')) === 'unavailable'
  ) {
    await import('/js/task-apis/writer.js');
  }
  if (typeof Writer !== 'undefined') {
    try {
      const status = await Writer.availability({
        sharedContext:
          'The user provides a few bullet points. Expand them into a detailed blog post.',
      });
      if (status !== 'unavailable') {
        ui.aiWriterSection.setAttribute('data-ai-available', 'true');
        ui.aiWriterBtn.setAttribute('data-ai-available', 'true');
        refreshAIVisibility(ui);
      } else {
        ui.aiWriterSection.setAttribute('data-ai-available', 'true');
        ui.aiWriterBtn.setAttribute('data-ai-available', 'true');
        refreshAIVisibility(ui);
      }
    } catch (e) {
      console.warn('AI Writer availability check failed', e);
      ui.aiWriterSection.setAttribute('data-ai-available', 'true');
      ui.aiWriterBtn.setAttribute('data-ai-available', 'true');
      refreshAIVisibility(ui);
    }
  }

  ui.aiWriterBtn.onclick = async () => {
    const input = ui.aiWriterInput.value.trim();
    if (!input) {
      return customAlert(ui, 'Please write some content first.');
    }

    let mode = 'replace';
    if (ui.contentInput.value.trim().length > 0) {
      const choice = await customConfirm(
        ui,
        'You already have content. Should the AI replace it or append at the end?',
        {
          confirmText: 'Append',
          cancelText: 'Replace',
        },
      );
      if (choice === 'confirm') {
        mode = 'append';
      } else if (choice !== 'cancel') {
        return;
      }
    }

    const isNative = Writer.toString().includes('[native code]');

    await runAIAction(
      ui,
      ui.aiWriterBtn,
      async () => {
        const lang = await detectLanguage(input);
        const options = getWriterOptions(ui, lang);
        const status = await Writer.availability(options);
        if (status === 'unavailable') {
          return customAlert(ui, `Writer unavailable for: ${lang}`);
        }

        if (mode === 'replace') {
          ui.contentInput.value = '';
        } else {
          ui.contentInput.value =
            ui.contentInput.value.replace(/\n+$/, '') + '\n\n';
        }

        const writer = await Writer.create(options);
        const stream = writer.writeStreaming(input);

        for await (const chunk of stream) {
          ui.contentInput.value += chunk;
          updateCallback();
        }
      },
      () => {
        ui.aiWriterInput.value = '';
        updateCallback();
      },
      isNative,
    );
  };
}
