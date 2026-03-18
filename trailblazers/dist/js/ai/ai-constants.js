/** @type {string[]} */
export const aiKeys = [
  'ai-backend',
  'ai-api-key',
  'ai-model-name',
  'ai-project-id',
  'ai-app-id',
  'ai-gemini-api-provider',
  'ai-use-app-check',
  'ai-recaptcha-site-key',
  'ai-use-limited-use-tokens',
  'ai-device',
  'ai-dtype',
];

/** @type {Object} */
export const DEFAULT_CONFIGS = {
  'gemini-api': { 'ai-api-key': '', 'ai-model-name': '' },
  openai: { 'ai-api-key': '', 'ai-model-name': '' },
  firebase: {
    'ai-api-key': '',
    'ai-model-name': '',
    'ai-project-id': '',
    'ai-app-id': '',
    'ai-gemini-api-provider': 'developer',
    'ai-use-app-check': false,
    'ai-recaptcha-site-key': '',
    'ai-use-limited-use-tokens': false,
  },
  'transformers-js': {
    'ai-model-name': '',
    'ai-device': 'webgpu',
    'ai-dtype': 'q4f16',
  },
};
