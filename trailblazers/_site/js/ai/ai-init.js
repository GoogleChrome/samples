/**
 * Dynamically imports and initializes all AI features.
 * @param {Object} ui - The UI elements.
 * @param {Function} sync - Function to sync draft data.
 * @param {Object} tagEditor - The tag editor component.
 * @return {Promise<void>}
 */
export async function initAIFeatures(ui, sync, tagEditor) {
  if (window.aiFeaturesInitialized) {
    return;
  }
  window.aiFeaturesInitialized = true;
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = '/js/ai/ai-multimodal.js';
  document.head.appendChild(link);
  const [
    { initAI },
    { initTagSuggestions },
    { initAIWriter },
    { initAIRewriter },
    { initAIClassifier },
  ] = await Promise.all([
    import('./ai-features.js'),
    import('./ai-tag-suggestions.js'),
    import('./ai-writer.js'),
    import('./ai-rewriter.js'),
    import('./ai-classifier.js'),
  ]);
  await Promise.all([
    initAI(ui, sync),
    initTagSuggestions(ui, async () => {
      if (tagEditor && typeof tagEditor.renderPills === 'function') {
        tagEditor.renderPills();
      } else {
        const { tagEditor: activeTagEditor } =
          await import('../editor/create-post.js');
        if (activeTagEditor) {
          activeTagEditor.renderPills();
        }
      }
      sync();
    }),
    initAIWriter(ui, sync),
    initAIRewriter(ui, sync),
    initAIClassifier(ui, sync),
  ]);
}

if (!window.aiFeaturesListenerAdded) {
  window.aiFeaturesListenerAdded = true;
  window.addEventListener('ai-features-toggled', async (e) => {
    if (e.detail) {
      const { sync, tagEditor } = await import('../editor/create-post.js');
      const { ui } = await import('../editor/ui-elements.js');
      await initAIFeatures(ui, sync, tagEditor);
    }
  });
}
