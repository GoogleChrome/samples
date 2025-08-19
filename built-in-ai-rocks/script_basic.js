const form = document.querySelector('form');
const input = document.querySelector('input');
const output = document.querySelector('output');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) {
    return;
  }
  output.innerHTML = '';

  const languageModel = await LanguageModel.create({
    expectedInputs: [{type: 'text', languages: ['en']}],
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
