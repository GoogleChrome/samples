import { detectLanguage } from './ai-language-detection.js';
import { customAlert, customConfirm } from '../utils/dialog-utils.js';
import { getMonitor, runAIAction } from './ai-features.js';
import { refreshAIVisibility } from './ai-toggle.js';

/**
 * Generates options for the AI Rewriter.
 * @param {Object} ui - The UI elements.
 * @param {string} lang - The language code.
 * @return {Object} The rewriter options.
 */
const getRewriterOptions = (ui, lang) => ({
  sharedContext: 'The user is rewriting a blog post.',
  tone: ui.aiRewriterTone.value,
  format: 'markdown',
  length: ui.aiRewriterLength.value,
  expectedInputLanguages: [lang],
  outputLanguage: lang,
  ...getMonitor(ui, lang, 'Rewriter'),
});

/**
 * Initializes the AI Rewriter feature.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback for UI updates.
 * @return {Promise<void>}
 */
export async function initAIRewriter(ui, updateCallback) {
  if (
    !('Rewriter' in self) ||
    (await self.Rewriter.availability({
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
    }).catch(() => 'unavailable')) === 'unavailable'
  ) {
    await import('/js/task-apis/rewriter.js');
  }
  if (typeof Rewriter !== 'undefined') {
    try {
      const status = await Rewriter.availability({
        sharedContext: 'Rewriting a blog post.',
      });
      if (status !== 'unavailable') {
        ui.aiRewriterSection.setAttribute('data-ai-available', 'true');
        ui.aiRewriterBtn.setAttribute('data-ai-available', 'true');
        refreshAIVisibility(ui);
      } else {
        ui.aiRewriterSection.setAttribute('data-ai-available', 'true');
        ui.aiRewriterBtn.setAttribute('data-ai-available', 'true');
        refreshAIVisibility(ui);
      }
    } catch (e) {
      console.warn('AI Rewriter availability check failed', e);
      ui.aiRewriterSection.setAttribute('data-ai-available', 'true');
      ui.aiRewriterBtn.setAttribute('data-ai-available', 'true');
      refreshAIVisibility(ui);
    }
  }

  ui.aiRewriterBtn.onclick = async () => {
    const fullContent = ui.contentInput.value;
    const selectionStart = ui.contentInput.selectionStart;
    const selectionEnd = ui.contentInput.selectionEnd;
    const selectedText = fullContent.substring(selectionStart, selectionEnd);

    let rewriteTarget = 'all';
    if (selectedText.trim().length > 0) {
      const choice = await customConfirm(
        ui,
        'You have selected text. Should the AI rewrite only the selection or the entire post?',
        {
          confirmText: 'Selection',
          cancelText: 'Entire post',
        },
      );
      if (choice === 'confirm') {
        rewriteTarget = 'selection';
      } else if (choice === 'cancel') {
        rewriteTarget = 'all';
      } else {
        return; // Dialog was dismissed without a choice
      }
    }

    const inputToRewrite =
      rewriteTarget === 'selection' ? selectedText : fullContent;

    if (!inputToRewrite.trim()) {
      return customAlert(ui, 'Please write some content first.');
    }

    const isNative = Rewriter.toString().includes('[native code]');

    await runAIAction(
      ui,
      ui.aiRewriterBtn,
      async () => {
        const lang = await detectLanguage(inputToRewrite);
        const options = getRewriterOptions(ui, lang);
        const status = await Rewriter.availability(options);

        if (status === 'unavailable') {
          return customAlert(ui, `Rewriter unavailable for: ${lang}`);
        }

        const partsSelectionAware = inputToRewrite.split(
          /(<figure>[\s\S]*?<\/figure>)/g,
        );
        const rewriter = await Rewriter.create(options);

        let rewrittenContent = '';

        for (const part of partsSelectionAware) {
          if (part.startsWith('<figure>')) {
            rewrittenContent =
              rewrittenContent.trimEnd() + '\n\n' + part + '\n\n';
          } else if (part.trim()) {
            const stream = rewriter.rewriteStreaming(part);
            for await (const chunk of stream) {
              rewrittenContent += chunk;
              // Real-time update in the text area
              if (rewriteTarget === 'selection') {
                ui.contentInput.value =
                  fullContent.substring(0, selectionStart) +
                  rewrittenContent +
                  fullContent.substring(selectionEnd);
              } else {
                ui.contentInput.value = rewrittenContent;
              }
              updateCallback();
            }
          }
        }
      },
      () => {
        ui.aiRewriterTone.value = 'as-is';
        ui.aiRewriterLength.value = 'as-is';
        updateCallback();
      },
      isNative,
    );
  };
}
