/**
 * Gathers translations from the UI and updates the draft.
 * @param {Object} draft - The draft to update.
 * @param {Object} ui - The UI elements.
 */
export function updateDraftTranslations(draft, ui) {
  if (!ui.aiTranslationsContainer) return;

  draft.translations = {};
  const slug = ui.getSlug(ui.titleInput.value);
  const translationElements = ui.aiTranslationsContainer.querySelectorAll(
    '.translation-markdown',
  );
  translationElements.forEach((el) => {
    const details = el.closest('details');
    if (!details) return;
    const locale = details.getAttribute('data-locale');

    const title =
      details.querySelector('.translation-title')?.value.trim() || '';
    const description =
      details.querySelector('.translation-description')?.value.trim() || '';
    const tags =
      details.querySelector('.translation-tags-hidden')?.value.trim() || '';

    if (el.value.trim() || title) {
      const localizedPath = `content/${locale}/blog/${slug}/${slug}.md`;
      draft.translations[locale] = {
        title,
        description,
        tags,
        content: el.value.trim(),
        path: localizedPath,
      };
    }
  });
}
