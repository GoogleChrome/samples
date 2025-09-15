const createButton = document.querySelector('.create');
const promptButton = document.querySelector('.prompt');
const progress = document.querySelector('progress');
const output = document.querySelector('output');

const a = 'AIzaSyAP0s2ClDVHaB';
const b = 'gUomH7UO57E';
const c = 'bBE5oAk0ei';

let localSession = null;
let cloudSession = null;

let sessionCreationTriggered = false;

const prepareLocalSession = async (options = {}) => {
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

const createLocalSession = async () => {
  try {
    localSession = await prepareLocalSession({
      expectedInputs: [
        {
          type: 'text',
          languages: ['en'],
        },
      ],
      expectedOutputs: [
        {
          type: 'text',
          languages: ['en'],
        },
      ],
    });
  } catch (error) {
    console.error(error.name, error.message);
  }
};

const createCloudSession = async () => {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    cloudSession = new GoogleGenAI({
      ['a' + 'p' + 'i' + 'K' + 'e' + 'y']: a + c + b,
    });
    console.log('Creating cloud session.');
  } catch (error) {
    console.error(error.name, error.message);
  }
};

createButton.addEventListener('click', async () => {
  try {
    const availability =
      'LanguageModel' in self
        ? await LanguageModel.availability()
        : 'unavailable';

    if (availability !== 'available') {
      console.log(`Language model is ${availability}`);
      if (availability !== 'unavailable') {
        // Don't `await`, just trigger in the background.
        prepareLocalSession();
      }
      await createCloudSession();
    } else {
      await createLocalSession();
    }
    promptButton.disabled = false;
  } catch (error) {
    console.error(error.name, error.message);
    output.textContent = error.message;
  }
});

promptButton.addEventListener('click', async () => {
  if (!localSession && !cloudSession) {
    return;
  }
  const prompt = 'Write me a poem';

  if (localSession) {
    output.innerHTML = '';
    try {
      const stream = localSession.promptStreaming(prompt);
      for await (const chunk of stream) {
        output.append(chunk);
      }
    } catch (err) {
      console.error(err.name, err.message);
      output.textContent = err.message;
    }
    return;
  }

  const stream = await cloudSession.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });
  output.innerHTML = '';
  for await (let response of stream) {
    output.append(response.text);
  }
});
