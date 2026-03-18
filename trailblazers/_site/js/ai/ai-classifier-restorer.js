import { renderClassifierResults } from './ai-classifier-renderer.js';

/**
 * Parses advertising categories from the content string or restores them from the draft object.
 * @param {Object} ui - The UI elements.
 * @param {Function} updateCallback - Callback to trigger after restoration.
 * @return {Promise<void>}
 */
export async function restoreClassifierResults(ui, updateCallback) {
  let results = [];
  const id = localStorage.getItem('current-draft-id');
  const drafts = JSON.parse(localStorage.getItem('blog-drafts') || '[]');
  const draft = drafts.find((d) => d.id === id);
  if (draft) {
    if (draft.classifierResults) {
      results = draft.classifierResults;
    } else if (draft.ad_categories) {
      const categories = Array.isArray(draft.ad_categories)
        ? draft.ad_categories
        : [draft.ad_categories];
      const confidences = Array.isArray(draft.ad_confidences)
        ? draft.ad_confidences
        : [draft.ad_confidences];
      results = categories.map((id, i) => ({
        id,
        confidence: confidences[i] ? parseFloat(confidences[i]) : null,
      }));
    }
  }

  if (results.length > 0) {
    await renderClassifierResults(ui, results, updateCallback);
  }
}
