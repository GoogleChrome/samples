# Prompt API Polyfill

This package provides a browser polyfill for the
[Prompt API `LanguageModel`](https://github.com/webmachinelearning/prompt-api),
supporting dynamic backends:

- **Firebase AI Logic** (cloud)
- **Google Gemini API** (cloud)
- **OpenAI API** (cloud)
- **Transformers.js** (local after initial model download, **default backend**)

When loaded in the browser, it defines a global:

```js
window.LanguageModel;
```

so you can use the Prompt API shape even in environments where it is not yet
natively available.

## Supported Backends

You can choose between multiple cloud and local backends. If no backend is
configured, the polyfill will use Transformers.js with the default model.

### Firebase AI Logic (cloud)

- **Uses**: `firebase/ai` SDK.
- **Select by setting**: `window.FIREBASE_CONFIG`.
- **API Provider**: Supports `"developer"` (Gemini Developer API, default) or
  `"vertex"` (Vertex AI).
- **App Check**: Supports optional App Check protection via `useAppCheck`,
  `reCaptchaSiteKey`, and `useLimitedUseAppCheckTokens`.
- **Model**: Uses default if not specified (see
  [`backends/defaults.js`](backends/defaults.js)).

### Google Gemini API (cloud)

- **Uses**: `@google/generative-ai` SDK.
- **Select by setting**: `window.GEMINI_CONFIG`.
- **Model**: Uses default if not specified (see
  [`backends/defaults.js`](backends/defaults.js)).

### OpenAI API (cloud)

- **Uses**: `openai` SDK.
- **Select by setting**: `window.OPENAI_CONFIG`.
- **Model**: Uses default if not specified (see
  [`backends/defaults.js`](backends/defaults.js)).

### Transformers.js (local after initial model download)

- **Uses**: `@huggingface/transformers` SDK.
- **Select by setting**: `window.TRANSFORMERS_CONFIG`.
- **Note**: This is the **default backend** if no other configuration is
  provided.
- **Model**: Uses default if not specified (see
  [`backends/defaults.js`](backends/defaults.js)).

---

## Installation

Install from npm:

```bash
npm install prompt-api-polyfill
```

## Quick start

### Backed by Firebase AI Logic (cloud)

1. **Create a Firebase project with Generative AI enabled**.
2. **Provide your Firebase config** on `window.FIREBASE_CONFIG`.
3. **Import the polyfill**.

```html
<script type="module">
  import firebaseConfig from './.env.json' with { type: 'json' };

  // Set FIREBASE_CONFIG to select the Firebase backend
  window.FIREBASE_CONFIG = firebaseConfig;

  if (!('LanguageModel' in window)) {
    await import('prompt-api-polyfill');
  }

  const session = await LanguageModel.create();
</script>
```

### Backed by Gemini API (cloud)

1. **Get a Gemini API Key** from
   [Google AI Studio](https://aistudio.google.com/).
2. **Provide your API Key** on `window.GEMINI_CONFIG`.
3. **Import the polyfill**.

```html
<script type="module">
  // NOTE: Do not expose real keys in production source code!
  // Set GEMINI_CONFIG to select the Gemini backend
  window.GEMINI_CONFIG = { apiKey: 'YOUR_GEMINI_API_KEY' };

  if (!('LanguageModel' in window)) {
    await import('prompt-api-polyfill');
  }

  const session = await LanguageModel.create();
</script>
```

### Backed by OpenAI API (cloud)

1. **Get an OpenAI API Key** from the
   [OpenAI Platform](https://platform.openai.com/).
2. **Provide your API Key** on `window.OPENAI_CONFIG`.
3. **Import the polyfill**.

```html
<script type="module">
  // NOTE: Do not expose real keys in production source code!
  // Set OPENAI_CONFIG to select the OpenAI backend
  window.OPENAI_CONFIG = { apiKey: 'YOUR_OPENAI_API_KEY' };

  if (!('LanguageModel' in window)) {
    await import('prompt-api-polyfill');
  }

  const session = await LanguageModel.create();
</script>
```

### Backed by Transformers.js (local after initial model download)

1. **Only a dummy API Key required** (runs locally in the browser).
2. **Provide configuration** on `window.TRANSFORMERS_CONFIG`.
3. **Import the polyfill**.

```html
<script type="module">
  // Set TRANSFORMERS_CONFIG to select the Transformers.js backend
  window.TRANSFORMERS_CONFIG = {
    apiKey: 'dummy', // Required for now by the loader
    device: 'webgpu', // 'webgpu' or 'cpu'
    dtype: 'q4f16', // Quantization level
    env: {
      // Optional: Pass low-level Transformers.js environment overrides
      allowRemoteModels: true,
      backends: {
        onnx: {
          wasm: {
            wasmPaths: 'https://cdn.example.com/wasm-assets/',
          },
        },
      },
    },
  };

  if (!('LanguageModel' in window)) {
    await import('prompt-api-polyfill');
  }

  const session = await LanguageModel.create();
</script>
```

---

## Configuration

### Example (using a JSON config file)

Create a `.env.json` file (see
[Configuring `dot_env.json` / `.env.json`](#configuring-dot_envjson--envjson))
and then use it from a browser entry point.

### Example based on `index.html` in this repo

The included `index.html` demonstrates the full surface area of the polyfill,
including:

- `LanguageModel.create()` with options
- `prompt()` and `promptStreaming()`
- Multimodal inputs (text, image, audio)
- `append()` and `measureContextUsage()`
- Quota handling via `oncontextoverflow`
- `clone()` and `destroy()`

A simplified version of how it is wired up:

```html
<script type="module">
  // Set GEMINI_CONFIG to select the Gemini backend
  window.GEMINI_CONFIG = { apiKey: 'YOUR_GEMINI_API_KEY' };

  // Load the polyfill only when necessary
  if (!('LanguageModel' in window)) {
    await import('prompt-api-polyfill');
  }

  const controller = new AbortController();
  const session = await LanguageModel.create();

  try {
    const stream = session.promptStreaming('Write me a very long poem', {
      signal: controller.signal,
    });

    for await (const chunk of stream) {
      console.log(chunk);
    }
  } catch (error) {
    console.error(error);
  }
</script>
```

---

## Configuring `dot_env.json` / `.env.json`

This repo ships with a template file:

```jsonc
// dot_env.json
{
  // For Firebase AI Logic:
  "projectId": "",
  "appId": "",
  "geminiApiProvider": "developer", // "developer" (default) or "vertex"
  "useAppCheck": false,
  "reCaptchaSiteKey": "",
  "useLimitedUseAppCheckTokens": false,
  "modelName": "",

  // For Firebase AI Logic OR Gemini OR OpenAI OR Transformers.js:
  "apiKey": "",

  // For Transformers.js:
  "device": "webgpu",
  "dtype": "q4f16",
  // Optional library-level overrides:
  "env": {
    "allowRemoteModels": true,
    "backends": {
      "onnx": {
        "wasm": {
          "wasmPaths": "https://cdn.example.com/wasm-assets/",
        },
      },
    },
  },
}
```

You should treat `dot_env.json` as a **template** and create a real `.env.json`
that is **not committed** with your secrets.

### Create `.env.json`

Copy the template:

```bash
cp dot_env.json .env.json
```

Then open `.env.json` and fill in the values.

**For Firebase AI Logic:**

```json
{
  "apiKey": "YOUR_FIREBASE_WEB_API_KEY",
  "projectId": "your-gcp-project-id",
  "appId": "YOUR_FIREBASE_APP_ID",
  "geminiApiProvider": "developer",
  "useAppCheck": false,
  "reCaptchaSiteKey": "YOUR_RECAPTCHA_SITE_KEY",
  "useLimitedUseAppCheckTokens": false,
  "modelName": "choose-model-for-firebase"
}
```

**For Gemini:**

```json
{
  "apiKey": "YOUR_GEMINI_CONFIG",
  "modelName": "choose-model-for-gemini"
}
```

**For OpenAI:**

```json
{
  "apiKey": "YOUR_OPENAI_API_KEY",
  "modelName": "choose-model-for-openai"
}
```

**For Transformers.js:**

```json
{
  "apiKey": "dummy",
  "modelName": "onnx-community/gemma-3-1b-it-ONNX-GQA",
  "device": "webgpu",
  "dtype": "q4f16",
  "env": {
    "allowRemoteModels": false,
    "backends": {
      "onnx": {
        "wasm": {
          "wasmPaths": "https://cdn.example.com/wasm-assets/"
        }
      }
    }
  }
}
```

### Field-by-field explanation

- `apiKey`:
  - **Firebase AI Logic**: Your Firebase Web API key.
  - **Gemini**: Your Gemini API Key.
  - **OpenAI**: Your OpenAI API Key.
  - **Transformers.js**: Use `"dummy"`.
- `projectId` / `appId`: **Firebase AI Logic only**.
- `geminiApiProvider`: **Firebase AI Logic only**. Either `"developer"` (Gemini
  Developer API, default) or `"vertex"` (Vertex AI).
- `useAppCheck`: **Firebase AI Logic only**. Whether to use Firebase App Check
  (default `false`).
- `reCaptchaSiteKey`: **Firebase AI Logic only**. Your reCAPTCHA Enterprise site
  key for App Check.
- `useLimitedUseAppCheckTokens`: **Firebase AI Logic only**. Whether to use
  limited-use tokens for enhanced protection (default `false`).

- `device`: **Transformers.js only**. Either `"webgpu"` or `"cpu"`.
- `dtype`: **Transformers.js only**. Quantization level (e.g., `"q4f16"`).
- `env` (optional): **Transformers.js only**. A flexible object to override
  [Transformers.js environment variables](https://huggingface.co/docs/transformers.js/api/env).
  This is useful for specifying local `wasmPaths` or proxy settings.

- `modelName` (optional): The model ID to use. If not provided, the polyfill
  uses the defaults defined in [`backends/defaults.js`](backends/defaults.js).

> **Important:** Do **not** commit a real `.env.json` with production
> credentials to source control. Use `dot_env.json` as the committed template
> and keep `.env.json` local.

### Wiring the config into the polyfill

Once `.env.json` is filled out, you can import it and expose it to the polyfill.
See the [Quick start](#quick-start) examples above. For Transformers.js, ensure
you set `window.TRANSFORMERS_CONFIG`.

---

## API surface

Once the polyfill is loaded and `window.LanguageModel` is available, you can use
it as described in the
[Prompt API documentation](https://developer.chrome.com/docs/ai/prompt-api).

For a complete, end-to-end example, see the `index.html` file in this directory.

---

## Running the demo locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy and fill in your config:

   ```bash
   cp dot_env.json .env.json
   ```

3. Serve `index.html`:
   ```bash
   npm start
   ```

You should see network requests to the backends logs.

---

## Testing

The project includes a test suite that ensures compliance with the Prompt API
specification using Web Platform Tests (WPT).

### Running WPT Tests

To run the WPT compliance tests:

```bash
npm run test:wpt
```

This script will sync the latest WPT tests, generate the necessary polyfill
wrappers, and open a browser instance to run the tests.

---

## Create your own backend provider

If you want to add your own backend provider, these are the steps to follow.

### Extend the base backend class

Create a new file in the `backends/` directory, for example,
`backends/custom.js`. You need to extend the `PolyfillBackend` class and
implement the core methods that satisfy the expected interface.

```js
import PolyfillBackend from './base.js';
import { DEFAULT_MODELS } from './defaults.js';

export default class CustomBackend extends PolyfillBackend {
  constructor(config) {
    // config typically comes from a window global (e.g., window.CUSTOM_CONFIG)
    super(config.modelName || DEFAULT_MODELS.custom.modelName);
  }

  // Check if the backend is configured (e.g., API key is present), if given
  // combinations of modelName and options are supported, or, for local model,
  // if the model is available.
  static availability(options) {
    return window.CUSTOM_CONFIG?.apiKey ? 'available' : 'unavailable';
  }

  // Initialize the underlying SDK or API client. With local models, use
  // monitorTarget to report model download progress to the polyfill.
  createSession(options, sessionParams, monitorTarget) {
    // Return the initialized session or client instance
  }

  // Non-streaming prompt execution
  async generateContent(contents) {
    // contents: Array of { role: 'user'|'model', parts: [{ text: string }] }
    // Return: { text: string, usage: number }
  }

  // Streaming prompt execution
  async generateContentStream(contents) {
    // Return: AsyncIterable yielding chunks
  }

  // Token counting for quota/usage tracking
  async countTokens(contents) {
    // Return: total token count (number)
  }
}
```

### Register your backend

The polyfill uses an automated registration strategy. To register your new
backend, simply run the registration script:

```bash
npm run generate:registry
```

This updates the `backends-registry.js` file, which the polyfill imports. The
registry contains the configuration mapping and a dynamic loader that ensures
compatibility with bundlers and CDNs.

### Set a default model

Define the fallback model identity in `backends/defaults.js`. This is used when
a user initializes a session without specifying a specific `modelName`.

```js
// backends/defaults.js
export const DEFAULT_MODELS = {
  // ...
  custom: { modelName: 'custom-model-pro-v1' },
};
```

### Enable local development and testing

The project uses a discovery script (`scripts/backend-discovery.js`) to generate
test matrices and list active backends based on the presence of
`.env-[name].json` files. To include your new backend in the test runner, create
a `.env-[name].json` file (for example, `.env-custom.json`) in the root
directory:

```json
{
  "apiKey": "your-api-key-here",
  "modelName": "custom-model-pro-v1"
}
```

Then run the WPT generation script:

```bash
npm run generate:wpt
```

### Verify via Web Platform Tests (WPT)

The final step is ensuring compliance. Because the polyfill is spec-driven, any
new backend should pass the official (or tentative) Web Platform Tests:

```bash
npm run test:wpt
```

This verification step ensures that your backend handles things like
`AbortSignal`, system prompts, and history formatting exactly as the Prompt API
specification expects.

---

## License

Apache 2.0
