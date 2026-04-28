import { browserAI } from '@browser-ai/core';
import { generateText, streamText, Output } from 'ai';
import z from 'zod';

function createSection(prompt: string): HTMLElement {
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  h2.textContent = prompt;
  section.append(h2);
  document.body.append(section);
  return section;
}

(async () => {
  // Provider switch UI.
  const form = document.createElement('form');
  const options: [string, string][] = [
    ['cloud', 'Cloud API (Gemini 2.5 Flash)'],
    ['builtIn', 'Built-in AI'],
  ];
  for (const [value, labelText] of options) {
    const label = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'provider';
    radio.value = value;
    if (value === 'cloud') radio.checked = true;
    label.append(radio, ' ', labelText);
    form.append(label, ' ');
  }
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Run';
  form.append(button);
  document.body.append(form);

  const useBuiltIn = await new Promise<boolean>(resolve => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      resolve(new FormData(form).get('provider') === 'builtIn');
    }, { once: true });
  });

  button.disabled = true;

  // Initialize the selected model.
  let model: any;
  if (useBuiltIn) {
    model = browserAI();
  } else {
    let apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      apiKey = prompt('Enter your Gemini API key:') ?? '';
      if (apiKey) localStorage.setItem('geminiApiKey', apiKey);
    }
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
    model = createGoogleGenerativeAI({ apiKey })('gemini-2.5-flash');
  }

  // availability() is only present on built-in AI models.
  if (typeof model.availability === 'function') {
    const availability = await model.availability();

    if (availability === 'unavailable') {
      document.body.append('Your browser cannot run the built-in model.');
      return;
    }

    if (availability === 'downloadable') {
      const progressSection = createSection('Downloading model…');
      await model.createSessionWithProgress((progress: number) => {
        progressSection.append(`${Math.round(progress * 100)}%\n`);
      });
    }
  }

  // Non-streaming text generation.
  const shortJokeSection = createSection('Tell me a short joke! (generateText)');
  const { text } = await generateText({
    model,
    prompt: 'Tell me a short joke',
  });
  const shortJokeP = document.createElement('p');
  shortJokeP.style.whiteSpace = 'pre-wrap';
  shortJokeP.append(text);
  shortJokeSection.append(shortJokeP);

  // Streaming text generation.
  const longJokeSection = createSection('Tell me a long joke! (streamText)');
  const longJokeP = document.createElement('p');
  longJokeP.style.whiteSpace = 'pre-wrap';
  longJokeSection.append(longJokeP);
  const streamResult = streamText({
    model,
    prompt: 'Tell me a long joke!',
  });
  for await (const chunk of streamResult.textStream) {
    longJokeP.append(chunk);
  }

  const schema = z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  });

  const recipePrompt = 'Generate a lasagna recipe.';

  // Non-streaming object generation.
  const objectSection = createSection(recipePrompt + ' (generateText)');
  const { output } = await generateText({
    model,
    output: Output.object({ schema }),
    prompt: recipePrompt,
  });
  const objectPre = document.createElement('pre');
  objectPre.textContent = JSON.stringify(output, null, 2);
  objectSection.append(objectPre);

  // Streaming object generation.
  const streamObjectSection = createSection(recipePrompt + ' (streamText)');
  const { partialOutputStream } = streamText({
    model,
    output: Output.object({ schema }),
    prompt: recipePrompt,
  });
  const streamObjectPre = document.createElement('pre');
  streamObjectSection.append(streamObjectPre);
  for await (const partialObject of partialOutputStream) {
    streamObjectPre.textContent = JSON.stringify(partialObject, null, 2);
  }
})();
