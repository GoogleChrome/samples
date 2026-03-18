import { getTaxonomy } from './ai-taxonomy-loader.js';

/**
 * Removes existing script tags related to Google Ad categories from the content.
 * @param {Object} ui - The UI elements.
 */
export function updateScriptTagInContent(ui) {
  let content = ui.contentInput.value.trim();

  if (ui.contentInput.value !== content) {
    ui.contentInput.value = content;
    ui.contentInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

/**
 * Gets the IDs of currently selected classifier results from the DOM.
 * @return {string[]} Array of category IDs.
 */
export function getSelectedClassifierIds() {
  return Array.from(document.querySelectorAll('.classifier-result-row')).map(
    (row) => row.getAttribute('data-category-id'),
  );
}

/**
 * Gets the currently selected classifier results with confidence scores.
 * @return {Array<{id: string, confidence: number}>} Array of results.
 */
export function getSelectedClassifierResults() {
  return Array.from(document.querySelectorAll('.classifier-result-row')).map(
    (row) => ({
      id: row.getAttribute('data-category-id'),
      confidence:
        parseFloat(row.querySelector('td:last-child').textContent) / 100,
    }),
  );
}

/**
 * Renders classifier results into a table in the UI.
 * @param {Object} ui - The UI elements.
 * @param {Array<Object>} results - The classifier results.
 * @param {Function} updateCallback - Optional callback (unused).
 * @return {Promise<void>}
 */
export async function renderClassifierResults(ui, results, updateCallback) {
  if (!results || results.length === 0) {
    ui.aiClassifierResults.innerHTML = '';
    return;
  }

  const taxonomy = await getTaxonomy();
  let html =
    '<table><thead><tr><th>Category</th><th>Confidence</th></tr></thead><tbody>';
  for (const res of results) {
    const categoryName = taxonomy[res.id] || res.id;
    html += `
<tr class="classifier-result-row" data-category-id="${res.id}">
  <td>
    <span class="tag-pill classifier-pill">
      ${categoryName}
      <button type="button" class="remove-tag" title="Remove category" onclick="this.closest('tr').remove(); window.dispatchEvent(new CustomEvent('classifier-updated'))">×</button>
    </span>
  </td>
  <td>${res.confidence ? Math.round(res.confidence * 100) + '%' : '-'}</td>
</tr>`;
  }
  html += '</tbody></table>';
  ui.aiClassifierResults.innerHTML = html;
}

window.getSelectedClassifierIds = getSelectedClassifierIds;
window.getSelectedClassifierResults = getSelectedClassifierResults;
window.renderClassifierResults = renderClassifierResults;
window.updateScriptTagInContent = updateScriptTagInContent;
