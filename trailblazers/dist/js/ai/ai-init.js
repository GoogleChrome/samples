function scheduleLanguageModelWarmup() {
  let done = false;

  const runWarmup = async () => {
    if (done) return;
    done = true;
    try {
      const session = await LanguageModel.create({
        expectedInputs: [{ type: 'text', languages: ['en'] }],
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
      });
      await session.prompt('Hi');
      session.destroy();
    } catch (_) {}
  };

  if (navigator.userActivation?.isActive) {
    runWarmup();
    return;
  }

  const onUserActivation = () => {
    if (navigator.userActivation?.isActive) runWarmup();
  };

  for (const type of ['click', 'keydown', 'touchstart']) {
    document.addEventListener(type, onUserActivation, {
      capture: true,
      passive: true,
      once: true,
    });
  }
}

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
  const isNativeLanguageModel = 'LanguageModel' in self;
  if (isNativeLanguageModel) {
    scheduleLanguageModelWarmup();
  }
  import('/js/ai/ai-multimodal.js');
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
