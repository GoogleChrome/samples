const form = document.querySelector('form');
const input = document.querySelector('input');
const output = document.querySelector('output');
const img = document.querySelector('img');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const textPrompt = input.value.trim();
  if (!textPrompt) {
    return;
  }
  const prompt = [{
    role: 'user',
    content: [
      { type: 'text', value: textPrompt },
      { type: 'image', value: img },
    ],
  }];
  output.innerHTML = '';
  const languageModel = await LanguageModel.create({
    expectedInputs: [{type: 'text', languages: ['en']}, {type: 'image'}],
    expectedOutputs: [{type: 'text', languages: ['en']}],
    initialPrompts: [{
      role: 'system',
      content: `You are a helpful general assistant with special knowledge about a person called Thomas (Tom) Steiner. ${document.querySelector('#bio').innerText}`,
    }],
  });
  const stream = languageModel.promptStreaming(prompt);
  for await (const chunk of stream) {
    output.append(chunk);
  }
});
