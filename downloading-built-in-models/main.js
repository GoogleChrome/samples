const createButton = document.querySelector('.create');
const promptButton = document.querySelector('.prompt');
const progress = document.querySelector('progress');
const output = document.querySelector('output');

let sessionCreationTriggered = false;

let localSession = null;

const createSession = async (options = {}) => {
  if (sessionCreationTriggered) {
    return;
  }
  progress.hidden = true;
  progress.value = 0;
  try {
    if (!('LanguageModel' in self)) {
      throw new Error('LanguageModel is not supported.');
    }
    const availability = await LanguageModel.availability();
    if (availability === 'unavailable') {
      throw new Error('LanguageModel is not available.');
    }
    let modelNewlyDownloaded = false;
    if (availability !== 'available') {
      modelNewlyDownloaded = true;
      progress.hidden = false;
    }
    console.log(`LanguageModel is ${availability}.`);
    sessionCreationTriggered = true;
    const llmSession = await LanguageModel.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded ${e.loaded * 100}%.`);
          progress.value = e.loaded;
          if (modelNewlyDownloaded && e.loaded === 1) {
            // The model was newly downloaded and needs to be extracted
            // and loaded into memory, so show the undetermined state.
            progress.removeAttribute('value');
          }
        });
      },
      ...options,
    });
    sessionCreationTriggered = false;
    return llmSession;
  } catch (error) {
    throw error;
  } finally {
    progress.hidden = true;
    progress.value = 0;
  }
};

createButton.addEventListener('click', async () => {
  try {
    localSession = await createSession({
      expectedInputs: [{ type: 'text', languages: ['en'] }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
    });
    promptButton.disabled = false;
  } catch (error) {
    console.error(error.name, error.message);
    output.textContent = error.message;
  }
});

promptButton.addEventListener('click', async () => {
  if (!localSession) {
    return;
  }
  output.innerHTML = '';
  try {
    const stream = localSession.promptStreaming('Write me a poem');
    for await (const chunk of stream) {
      output.append(chunk);
    }
  } catch (err) {
    console.error(err.name, err.message);
    output.textContent = err.message;
  }
});
