import { runTranslation } from './ai-translator-core.js';
import { initTagEditor } from '../editor/tag-editor.js';
import { updatePreview } from './ai-translator-preview.js';

/**
 * Creates a <details> element for a specific locale translation.
 * @param {Object} ui - The UI elements.
 * @param {string} locale - The locale code.
 * @param {Function} updateCallback - Callback for UI updates.
 */
export function createTranslationDetails(ui, locale, updateCallback) {
  const details = document.createElement('details');
  details.setAttribute('data-locale', locale);
  details.className = 'translation-details';
  details.style.marginBottom = '1rem';
  details.style.border = '1px solid var(--border-color)';
  details.style.borderRadius = '4px';
  details.style.padding = '0.5rem';

  const displayName = new Intl.DisplayNames(['en'], { type: 'language' }).of(
    locale,
  );

  details.innerHTML = `
    <summary style="cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: space-between;">
      <span>${displayName}</span>
      <button type="button" class="btn ai-button translate-btn" data-ai-available="true" title="Translate whole post" style="font-size: 0.8rem; padding: 2px 8px;">✨</button>
    </summary>
    <div class="translation-content-wrapper" style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
      <input type="text" class="translation-title" placeholder="Translated Title..." style="width: 100%; padding: 0.4rem; border: 1px solid var(--border-color); border-radius: 4px;">
      <textarea class="translation-description" placeholder="Translated Description..." style="width: 100%; height: 60px; padding: 0.4rem; border: 1px solid var(--border-color); border-radius: 4px;"></textarea>
      
      <div class="translation-tags-wrapper">
        <div class="tag-pills translation-tag-pills" style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px;"></div>
        <input type="text" class="translation-tag-input" placeholder="Add tag (Enter)..." style="width: 100%; padding: 0.4rem; border: 1px solid var(--border-color); border-radius: 4px;">
        <input type="hidden" class="translation-tags-hidden">
      </div>

      <textarea class="translation-markdown" style="width: 100%; height: 200px; display: none;" placeholder="Translated Markdown..."></textarea>
      <div class="translation-preview markdown-body" style="padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; min-height: 50px;"></div>
    </div>
  `;

  ui.aiTranslationsContainer.appendChild(details);

  const translateBtn = details.querySelector('.translate-btn');
  const textarea = details.querySelector('.translation-markdown');
  const preview = details.querySelector('.translation-preview');
  const titleInput = details.querySelector('.translation-title');
  const descInput = details.querySelector('.translation-description');
  const tagInput = details.querySelector('.translation-tag-input');
  const tagPills = details.querySelector('.translation-tag-pills');
  const tagsHidden = details.querySelector('.translation-tags-hidden');

  // Initialize TagEditor for this locale
  const localeUI = {
    tagInput,
    tagPills,
    tagsInput: tagsHidden,
    getTags: () =>
      tagsHidden.value ? tagsHidden.value.split(',').map((t) => t.trim()) : [],
    aiOnlyExistingTagsToggle: ui.aiOnlyExistingTagsToggle,
  };
  const tagEditor = initTagEditor(localeUI, () => {
    updatePreview(textarea, preview);
    updateCallback();
  });
  details._tagEditor = tagEditor;

  details.ontoggle = () => {
    if (details.open && !textarea.value) {
      runTranslation(ui, locale, details, updateCallback);
    }
  };

  translateBtn.onclick = (e) => {
    e.stopPropagation();
    runTranslation(ui, locale, details, updateCallback);
  };

  const onMetaChange = () => {
    updatePreview(textarea, preview);
    updateCallback();
  };

  titleInput.oninput = onMetaChange;
  descInput.oninput = onMetaChange;
  textarea.onkeyup = () => {
    updatePreview(textarea, preview);
    updateCallback();
  };
}
