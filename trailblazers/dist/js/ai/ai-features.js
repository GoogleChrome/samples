import { detectLanguage } from './ai-language-detection.js';
import { customAlert } from '../utils/dialog-utils.js';
import { refreshAIVisibility } from './ai-toggle.js';
import { getMonitor, runAIAction } from './ai-ui-utils.js';

export { getMonitor, runAIAction };

/**
 * Generates options for the AI Summarizer.
 * @param {Object} ui - The UI elements.
 * @param {string} lang - The language code.
 * @param {string} type - The summary type (e.g., 'headline', 'teaser').
 * @return {Object} The summarizer options.
 */
const getSummarizerOptions = (ui, lang, type) => ({
  type,
  format: 'plain-text',
  expectedInputLanguages: [lang],
  outputLanguage: lang,
  ...getMonitor(ui, lang, 'AI Summarizer'),
});

/**
 * Runs the AI Summarizer to generate a headline or teaser.
 * @param {Object} ui - The UI elements.
 * @param {string} type - The summary type ('headline' or 'teaser').
 * @param {string} input - The input text to summarize.
 * @param {HTMLInputElement|HTMLTextAreaElement} targetInput - The field to populate.
 * @param {Function} updateCallback - Callback for UI updates.
 * @return {Promise<void>}
 */
async function runSummarizer(ui, type, input, targetInput, updateCallback) {
  if (!input || input.length < 20) {
    return customAlert(ui, 'Please write some content first.');
  }
  const btn =
    type === 'headline' ? ui.aiSuggestTitleBtn : ui.aiSuggestDescriptionBtn;

  const isNative = Summarizer.toString().includes('[native code]');

  await runAIAction(
    ui,
    btn,
    async () => {
      const lang = await detectLanguage(input);
      const options = getSummarizerOptions(ui, lang, type);
      const status = await Summarizer.availability(options);
      if (status === 'unavailable') {
        return customAlert(ui, `Summarizer unavailable for: ${lang}`);
      }

      const summarizer = await Summarizer.create(options);
      const stream = summarizer.summarizeStreaming(input);
      targetInput.value = '';
      for await (const chunk of stream) {
        targetInput.value += chunk;
        updateCallback();
      }
      targetInput.value = targetInput.value.trim().replace(/^["']|["']$/g, '');
      if (type === 'headline') {
        targetInput.value = targetInput.value.replace(/\.$/, '');
      }
    },
    updateCallback,
    isNative,
  );
}

/**
 * Initializes AI features, specifically the Summarizer and Translator.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback for UI updates.
 * @return {Promise<void>}
 */
export async function initAI(ui, updateCallback) {
  if (
    !('Summarizer' in self) ||
    (await self.Summarizer.availability({
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
    }).catch(() => 'unavailable')) === 'unavailable'
  ) {
    await import('/js/task-apis/summarizer.js');
  }
  if (typeof Summarizer !== 'undefined') {
    try {
      const status = await Summarizer.availability({
        type: 'teaser',
        format: 'plain-text',
        expectedInputLanguages: ['en'],
        outputLanguage: 'en',
      });
      if (status !== 'unavailable') {
        ui.aiSuggestTitleBtn.setAttribute('data-ai-available', 'true');
        ui.aiSuggestDescriptionBtn.setAttribute('data-ai-available', 'true');
        refreshAIVisibility(ui);
      } else {
        // Even if status is unavailable, if it's the polyfill, it might just be missing keys.
        // We show it anyway if the API is defined.
        ui.aiSuggestTitleBtn.setAttribute('data-ai-available', 'true');
        ui.aiSuggestDescriptionBtn.setAttribute('data-ai-available', 'true');
        refreshAIVisibility(ui);
      }
      if (status === 'downloadable' || status === 'downloading') {
        ui.aiStatus.style.display = 'flex';
        ui.aiStatusText.textContent = 'AI model available (needs download)';
      }
    } catch (e) {
      console.warn('AI Summarizer availability check failed', e);
      // Fallback: show buttons if the API exists
      ui.aiSuggestTitleBtn.setAttribute('data-ai-available', 'true');
      ui.aiSuggestDescriptionBtn.setAttribute('data-ai-available', 'true');
      refreshAIVisibility(ui);
    }
  }
  ui.aiSuggestTitleBtn.onclick = () =>
    runSummarizer(
      ui,
      'headline',
      ui.contentInput.value,
      ui.titleInput,
      updateCallback,
    );
  ui.aiSuggestDescriptionBtn.onclick = () => {
    const input = `Title: ${ui.titleInput.value}\n\nContent: ${ui.contentInput.value}`;
    runSummarizer(ui, 'teaser', input, ui.descInput, updateCallback);
  };
}
