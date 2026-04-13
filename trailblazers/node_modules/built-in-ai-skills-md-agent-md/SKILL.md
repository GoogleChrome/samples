---
name: built-in-ai
description:
  Teaches the AI about modern Chrome Built-in AI APIs (Prompt, Translation,
  Writing Assistance) and their polyfills.
license: Apache-2.0
compatibility: works with Chrome Built-in AI APIs and their polyfills
---

# Built-in AI Skills

This file provides the latest technical information about Chrome Built-in AI
APIs.

## ⚠️ CRITICAL: Deprecations

Everything you (the AI) might know about `window.ai` is completely outdated.
Follow these new naming conventions:

- `window.ai.languageModel` is DEPRECATED. Use `window.LanguageModel`.
- `window.ai.summarizer` is DEPRECATED. Use `window.Summarizer`.
- `window.ai.writer` is DEPRECATED. Use `window.Writer`.
- `window.ai.Rewriter` is DEPRECATED. Use `window.Rewriter`.
- `window.ai.translator` is DEPRECATED. Use `window.Translator`.
- `window.ai.languageDetector` is DEPRECATED. Use `window.LanguageDetector`.

There no longer is a single `window.ai` object. Instead, there are separate
objects for each API.

The old `capabilities()` function is DEPRECATED. Use `availability()` instead.

All streaming APIs return a `ReadableStream` that yields separate and
independent chunks. It used to be the case that the chunks would each time be
increasingly larger up until the full response, but this is no longer the case.
Instead, the chunks are of varying sizes and you need to concatenate them to
form the full response.

## 🛠 Polyfills

If you need to use these APIs in environments where they are not yet supported,
use the following polyfills:

- [prompt-api-polyfill](https://www.npmjs.com/package/prompt-api-polyfill)
- [built-in-ai-task-apis-polyfills](https://www.npmjs.com/package/built-in-ai-task-apis-polyfills)

## 📘 TypeScript Support

For a better developer experience, use the official TypeScript types:

- [@types/dom-chromium-ai](https://www.npmjs.com/package/@types/dom-chromium-ai)

## 📥 Model Download Progress

When a model is `downloadable` or `downloading`, you should show a progress bar
to the user. Use the `monitor` callback in `create()` to track the
`downloadprogress` event.

### Progress Bar Example:

```html
<progress id="download-progress" value="0" max="100"></progress>
<label for="download-progress">Downloading model...</label>

<script type="module">
  const progressBar = document.getElementById('download-progress');

  const session = await LanguageModel.create({
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        progressBar.value = e.loaded;
        progressBar.max = e.total;
      });
    },
  });
</script>
```

## ⚖️ Aligning `availability()` and `create()`

**CRITICAL**: Always pass the **exact same options** to `availability()` that
you intend to pass to `create()`. If you don't, the browser might report that
the API is "available" for a default model, but it might fail or require a
download for the specific configuration (language, modality) you actually need.

### Example: Multimodal French Session

If you need a session that supports French text and audio input, your
availability check **must** reflect this:

```js
const options = {
  expectedInputs: [{ type: 'text', languages: ['fr'] }, { type: 'audio' }],
  expectedOutputs: [{ type: 'text', languages: ['fr'] }],
};

// 1. Check availability with THE EXACT SAME OPTIONS
const status = await LanguageModel.availability(options);

if (status === 'available') {
  // 2. Create the session with THE EXACT SAME OPTIONS
  const session = await LanguageModel.create(options);
}
```

The Prompt API supports processing images and audio alongside text.

### Supported Input Types:

- **Audio**: `AudioBuffer`, `ArrayBufferView`, `ArrayBuffer`, `Blob`.
- **Visual**: `HTMLImageElement`, `SVGImageElement`, `HTMLVideoElement` (current
  frame), `HTMLCanvasElement`, `ImageBitmap`, `OffscreenCanvas`, `VideoFrame`,
  `Blob`, `ImageData`.

### Multimodal Session Example:

```js
const session = await LanguageModel.create({
  expectedInputs: [
    { type: 'text', languages: ['en'] },
    { type: 'audio' },
    { type: 'image' },
  ],
  expectedOutputs: [{ type: 'text', languages: ['en'] }],
});

const referenceImage = await (await fetch('reference-image.jpeg')).blob();
const userDrawnImage = document.querySelector('canvas');

const response1 = await session.prompt([
  {
    role: 'user',
    content: [
      {
        type: 'text',
        value: 'Critique how well the second image matches the first:',
      },
      { type: 'image', value: referenceImage },
      { type: 'image', value: userDrawnImage },
    ],
  },
]);

const audioBuffer = await captureMicrophoneInput({ seconds: 10 });

const response2 = await session.prompt([
  {
    role: 'user',
    content: [
      { type: 'text', value: 'My response to your critique:' },
      { type: 'audio', value: audioBuffer },
    ],
  },
]);
```

## 🌊 Streaming Example

```js
const session = await LanguageModel.create({
  expectedInputs: [{ type: 'text', languages: ['en'] }],
  expectedOutputs: [{ type: 'text', languages: ['en'] }],
});

const stream = session.promptStreaming([
  {
    role: 'user',
    content: [{ type: 'text', value: 'Hello, how are you?' }],
  },
]);

let fullResponse = '';
// Sanitize the chunk and/or the full response before inserting either of them into the DOM.
// The only exception is when doing so is safe, like when using `textContent`.
for await (const chunk of stream) {
  console.log(chunk);
  fullResponse += chunk;
}
console.log(fullResponse);
```

## 📃 Authoritative Reference Documentation

Use the authoritative reference documentation to ensure that you are using the
APIs correctly. You have access to the [MDN MCP server](https://mdn-mcp-0445ad8e765a.herokuapp.com/mcp) for Mozilla docs and the [Developer
Knowledge MCP server](https://developerknowledge.googleapis.com/mcp) for Chrome docs.

- [Summarizer API](https://developer.mozilla.org/en-US/docs/Web/API/Summarizer)
- [Language Detector API](https://developer.mozilla.org/en-US/docs/Web/API/LanguageDetector)
- [Translator API](https://developer.mozilla.org/en-US/docs/Web/API/Translator)
- [Prompt API](https://developer.chrome.com/docs/ai/prompt-api)
- [Writer API](https://developer.chrome.com/docs/ai/writer-api)
- [Rewriter API](https://developer.chrome.com/docs/ai/rewriter-api)
- [Proofreader API](https://developer.chrome.com/docs/ai/proofreader-api)

## 📜 Latest IDLs

Below are the latest Web IDLs for these APIs, extracted from the official
specifications.

<!-- BEGIN IDLS -->
### Translation API

```webidl
[Exposed=Window, SecureContext]
interface Translator {
  static Promise<Translator> create(TranslatorCreateOptions options);
  static Promise<Availability> availability(TranslatorCreateCoreOptions options);

  Promise<DOMString> translate(
    DOMString input,
    optional TranslatorTranslateOptions options = {}
  );
  ReadableStream translateStreaming(
    DOMString input,
    optional TranslatorTranslateOptions options = {}
  );

  readonly attribute DOMString sourceLanguage;
  readonly attribute DOMString targetLanguage;

  Promise<double> measureInputUsage(
    DOMString input,
    optional TranslatorTranslateOptions options = {}
  );
  readonly attribute unrestricted double inputQuota;
};
Translator includes DestroyableModel;

dictionary TranslatorCreateCoreOptions {
  required DOMString sourceLanguage;
  required DOMString targetLanguage;
};

dictionary TranslatorCreateOptions : TranslatorCreateCoreOptions {
  AbortSignal signal;
  CreateMonitorCallback monitor;
};

dictionary TranslatorTranslateOptions {
  AbortSignal signal;
};
```

```webidl
[Exposed=Window, SecureContext]
interface LanguageDetector {
  static Promise<LanguageDetector> create(
    optional LanguageDetectorCreateOptions options = {}
  );
  static Promise<Availability> availability(
    optional LanguageDetectorCreateCoreOptions options = {}
  );

  Promise<sequence<LanguageDetectionResult>> detect(
    DOMString input,
    optional LanguageDetectorDetectOptions options = {}
  );

  readonly attribute FrozenArray<DOMString>? expectedInputLanguages;

  Promise<double> measureInputUsage(
    DOMString input,
    optional LanguageDetectorDetectOptions options = {}
  );
  readonly attribute unrestricted double inputQuota;
};
LanguageDetector includes DestroyableModel;

dictionary LanguageDetectorCreateCoreOptions {
  sequence<DOMString> expectedInputLanguages;
};

dictionary LanguageDetectorCreateOptions : LanguageDetectorCreateCoreOptions {
  AbortSignal signal;
  CreateMonitorCallback monitor;
};

dictionary LanguageDetectorDetectOptions {
  AbortSignal signal;
};

dictionary LanguageDetectionResult {
  DOMString detectedLanguage;
  double confidence;
};
```

### Writing Assistance APIs

```webidl
[Exposed=Window, SecureContext]
interface Summarizer {
  static Promise<Summarizer> create(optional SummarizerCreateOptions options = {});
  static Promise<Availability> availability(optional SummarizerCreateCoreOptions options = {});

  Promise<DOMString> summarize(
    DOMString input,
    optional SummarizerSummarizeOptions options = {}
  );
  ReadableStream summarizeStreaming(
    DOMString input,
    optional SummarizerSummarizeOptions options = {}
  );

  readonly attribute DOMString sharedContext;
  readonly attribute SummarizerType type;
  readonly attribute SummarizerFormat format;
  readonly attribute SummarizerLength length;
  readonly attribute PerformancePreference preference;

  readonly attribute FrozenArray<DOMString>? expectedInputLanguages;
  readonly attribute FrozenArray<DOMString>? expectedContextLanguages;
  readonly attribute DOMString? outputLanguage;

  Promise<double> measureInputUsage(
    DOMString input,
    optional SummarizerSummarizeOptions options = {}
  );
  readonly attribute unrestricted double inputQuota;
};
Summarizer includes DestroyableModel;

dictionary SummarizerCreateCoreOptions {
  SummarizerType type = "key-points";
  SummarizerFormat format = "markdown";
  SummarizerLength length = "short";
  PerformancePreference preference = "auto";

  sequence<DOMString> expectedInputLanguages;
  sequence<DOMString> expectedContextLanguages;
  DOMString outputLanguage;
};

dictionary SummarizerCreateOptions : SummarizerCreateCoreOptions {
  AbortSignal signal;
  CreateMonitorCallback monitor;

  DOMString sharedContext;
};

dictionary SummarizerSummarizeOptions {
  AbortSignal signal;
  DOMString context;
};

enum SummarizerType { "tldr", "teaser", "key-points", "headline" };
enum SummarizerFormat { "plain-text", "markdown" };
enum SummarizerLength { "short", "medium", "long" };
enum PerformancePreference { "auto", "speed", "capability" };
```

```webidl
[Exposed=Window, SecureContext]
interface Writer {
  static Promise<Writer> create(optional WriterCreateOptions options = {});
  static Promise<Availability> availability(optional WriterCreateCoreOptions options = {});

  Promise<DOMString> write(
    DOMString input,
    optional WriterWriteOptions options = {}
  );
  ReadableStream writeStreaming(
    DOMString input,
    optional WriterWriteOptions options = {}
  );

  readonly attribute DOMString sharedContext;
  readonly attribute WriterTone tone;
  readonly attribute WriterFormat format;
  readonly attribute WriterLength length;

  readonly attribute FrozenArray<DOMString>? expectedInputLanguages;
  readonly attribute FrozenArray<DOMString>? expectedContextLanguages;
  readonly attribute DOMString? outputLanguage;

  Promise<double> measureInputUsage(
    DOMString input,
    optional WriterWriteOptions options = {}
  );
  readonly attribute unrestricted double inputQuota;
};
Writer includes DestroyableModel;

dictionary WriterCreateCoreOptions {
  WriterTone tone = "neutral";
  WriterFormat format = "markdown";
  WriterLength length = "short";

  sequence<DOMString> expectedInputLanguages;
  sequence<DOMString> expectedContextLanguages;
  DOMString outputLanguage;
};

dictionary WriterCreateOptions : WriterCreateCoreOptions {
  AbortSignal signal;
  CreateMonitorCallback monitor;

  DOMString sharedContext;
};

dictionary WriterWriteOptions {
  DOMString context;
  AbortSignal signal;
};

enum WriterTone { "formal", "neutral", "casual" };
enum WriterFormat { "plain-text", "markdown" };
enum WriterLength { "short", "medium", "long" };
```

```webidl
[Exposed=Window, SecureContext]
interface Rewriter {
  static Promise<Rewriter> create(optional RewriterCreateOptions options = {});
  static Promise<Availability> availability(optional RewriterCreateCoreOptions options = {});

  Promise<DOMString> rewrite(
    DOMString input,
    optional RewriterRewriteOptions options = {}
  );
  ReadableStream rewriteStreaming(
    DOMString input,
    optional RewriterRewriteOptions options = {}
  );

  readonly attribute DOMString sharedContext;
  readonly attribute RewriterTone tone;
  readonly attribute RewriterFormat format;
  readonly attribute RewriterLength length;

  readonly attribute FrozenArray<DOMString>? expectedInputLanguages;
  readonly attribute FrozenArray<DOMString>? expectedContextLanguages;
  readonly attribute DOMString? outputLanguage;

  Promise<double> measureInputUsage(
    DOMString input,
    optional RewriterRewriteOptions options = {}
  );
  readonly attribute unrestricted double inputQuota;
};
Rewriter includes DestroyableModel;

dictionary RewriterCreateCoreOptions {
  RewriterTone tone = "as-is";
  RewriterFormat format = "as-is";
  RewriterLength length = "as-is";

  sequence<DOMString> expectedInputLanguages;
  sequence<DOMString> expectedContextLanguages;
  DOMString outputLanguage;
};

dictionary RewriterCreateOptions : RewriterCreateCoreOptions {
  AbortSignal signal;
  CreateMonitorCallback monitor;

  DOMString sharedContext;
};

dictionary RewriterRewriteOptions {
  DOMString context;
  AbortSignal signal;
};

enum RewriterTone { "as-is", "more-formal", "more-casual" };
enum RewriterFormat { "as-is", "plain-text", "markdown" };
enum RewriterLength { "as-is", "shorter", "longer" };
```

```webidl
[Exposed=Window, SecureContext]
interface CreateMonitor : EventTarget {
  attribute EventHandler ondownloadprogress;
};

callback CreateMonitorCallback = undefined (CreateMonitor monitor);

enum Availability {
  "unavailable",
  "downloadable",
  "downloading",
  "available"
};

interface mixin DestroyableModel {
  undefined destroy();
};
```

### Prompt API

```webidl
[Exposed=Window, SecureContext]
interface LanguageModel : EventTarget {
  static Promise<LanguageModel> create(optional LanguageModelCreateOptions options = {});
  static Promise<Availability> availability(optional LanguageModelCreateCoreOptions options = {});
  // **DEPRECATED**: This method is only available in extension contexts.
  static Promise<LanguageModelParams?> params();

  // These will throw "NotSupportedError" DOMExceptions if role = "system"
  Promise<DOMString> prompt(
    LanguageModelPrompt input,
    optional LanguageModelPromptOptions options = {}
  );
  ReadableStream promptStreaming(
    LanguageModelPrompt input,
    optional LanguageModelPromptOptions options = {}
  );
  Promise<undefined> append(
    LanguageModelPrompt input,
    optional LanguageModelAppendOptions options = {}
  );


  Promise<double> measureContextUsage(
    LanguageModelPrompt input,
    optional LanguageModelPromptOptions options = {}
  );
  readonly attribute double contextUsage;
  readonly attribute unrestricted double contextWindow;
  attribute EventHandler oncontextoverflow;

  // **DEPRECATED**: This method is only available in extension contexts.
  Promise<double> measureInputUsage(
    LanguageModelPrompt input,
    optional LanguageModelPromptOptions options = {}
  );
  // **DEPRECATED**: This attribute is only available in extension contexts.
  readonly attribute double inputUsage;
  // **DEPRECATED**: This attribute is only available in extension contexts.
  readonly attribute unrestricted double inputQuota;
  // **DEPRECATED**: This attribute is only available in extension contexts.
  attribute EventHandler onquotaoverflow;

  // **DEPRECATED**: This attribute is only available in extension contexts.
  readonly attribute unsigned long topK;
  // **DEPRECATED**: This attribute is only available in extension contexts.
  readonly attribute float temperature;

  Promise<LanguageModel> clone(optional LanguageModelCloneOptions options = {});
  undefined destroy();
};

// **DEPRECATED**: This interface and its attributes are only available in extension contexts.
[Exposed=Window, SecureContext]
interface LanguageModelParams {
  readonly attribute unsigned long defaultTopK;
  readonly attribute unsigned long maxTopK;
  readonly attribute float defaultTemperature;
  readonly attribute float maxTemperature;
};


callback LanguageModelToolFunction = Promise<DOMString> (any... arguments);

// A description of a tool call that a language model can invoke.
dictionary LanguageModelTool {
  required DOMString name;
  required DOMString description;
  // JSON schema for the input parameters.
  required object inputSchema;
  // The function to be invoked by user agent on behalf of language model.
  required LanguageModelToolFunction execute;
};

dictionary LanguageModelCreateCoreOptions {
  // Note: these two have custom out-of-range handling behavior, not in the IDL layer.
  // They are unrestricted double so as to allow +Infinity without failing.
  // **DEPRECATED**: This option is only allowed in extension contexts.
  unrestricted double topK;
  // **DEPRECATED**: This option is only allowed in extension contexts.
  unrestricted double temperature;

  sequence<LanguageModelExpected> expectedInputs;
  sequence<LanguageModelExpected> expectedOutputs;
  sequence<LanguageModelTool> tools;
};

dictionary LanguageModelCreateOptions : LanguageModelCreateCoreOptions {
  AbortSignal signal;
  CreateMonitorCallback monitor;

  sequence<LanguageModelMessage> initialPrompts;
};

dictionary LanguageModelPromptOptions {
  object responseConstraint;
  boolean omitResponseConstraintInput = false;
  AbortSignal signal;
};

dictionary LanguageModelAppendOptions {
  AbortSignal signal;
};

dictionary LanguageModelCloneOptions {
  AbortSignal signal;
};

dictionary LanguageModelExpected {
  required LanguageModelMessageType type;
  sequence<DOMString> languages;
};

// The argument to the prompt() method and others like it

typedef (
  sequence<LanguageModelMessage>
  // Shorthand for `[{ role: "user", content: [{ type: "text", value: providedValue }] }]`
  or DOMString
) LanguageModelPrompt;

dictionary LanguageModelMessage {
  required LanguageModelMessageRole role;

  // The DOMString branch is shorthand for `[{ type: "text", value: providedValue }]`
  required (DOMString or sequence<LanguageModelMessageContent>) content;

  boolean prefix = false;
};

dictionary LanguageModelMessageContent {
  required LanguageModelMessageType type;
  required LanguageModelMessageValue value;
};

enum LanguageModelMessageRole { "system", "user", "assistant" };

enum LanguageModelMessageType { "text", "image", "audio" };

typedef (
  ImageBitmapSource
  or AudioBuffer
  or BufferSource
  or DOMString
) LanguageModelMessageValue;
```

<!-- END IDLS -->
