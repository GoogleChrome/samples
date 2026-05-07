/**
 * Comment classifier using the Chrome Prompt API with structured output.
 * Classifies user comments into: Safe | Illegal | Harmful | Language
 */

const SCHEMA = {
  type: 'object',
  properties: {
    classification: {
      type: 'string',
      enum: ['Safe', 'Illegal', 'Harmful', 'Language'],
    },
    reason: {
      type: 'string',
    },
  },
  required: ['classification', 'reason'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are a comment moderator for a travel blog.
Classify each user-submitted comment into exactly one of these categories:
- Safe: The comment is appropriate, on-topic, and can be published as-is.
- Illegal: The comment contains threats, doxxing, CSAM, or promotes illegal activities.
- Harmful: The comment is abusive, harassing, dangerous, or targets individuals harmfully.
- Language: The comment contains profanity, slurs, or other inappropriate language.
Provide a brief, one-sentence reason for your classification.`;

/** @type {LanguageModel | null} */
let _session = null;

/** @type {Promise<boolean> | null} */
let _initPromise = null;

/**
 * Checks availability of the LanguageModel API, loading the polyfill if needed.
 * @returns {Promise<Availability>}
 */
export async function getAvailability() {
  if (!('LanguageModel' in globalThis)) {
    try {
      window.FIREBASE_CONFIG = {
        ['api' + 'Key']: "AIzaSyCMqc" + "XKfIgiMF2OUkHCfIssGD" + "_" + "m1rLYp30",
        authDomain: "alf-web-samples.firebaseapp.com",
        projectId: "alf-web-samples",
        storageBucket: "alf-web-samples.firebasestorage.app",
        messagingSenderId: "168715621722",
        appId: "1:168715621722:web:964519a8c1fc12a43f4f63",
        useAppCheck: true,
        geminiApiProvider: 'developer',
        reCaptchaSiteKey: "https://pantheon.corp.google.com/security/recaptcha/6LcXid0sAAAAAKZv6lo4VKpfPEFmIVrszDQCoc67/overview?authuser=0&project=alf-web-samples",
        useLimitedUseAppCheckTokens: false,
      };

      await import('/js/prompt-api-polyfill.js');
    } catch {
      // Polyfill unavailable or failed to load
    }
  }
  if (!('LanguageModel' in globalThis)) return 'unavailable';
  try {
    return await LanguageModel.availability();
  } catch {
    return 'unavailable';
  }
}

/**
 * Initializes the LanguageModel session for comment classification.
 * Safe to call multiple times — subsequent calls return the cached result.
 *
 * @param {function(number, number): void} [onProgress]
 *   Called with (loaded, total) bytes during model download.
 * @returns {Promise<boolean>} True if the session was created successfully.
 */
export async function initClassifier(onProgress) {
  if (_session) return true;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const status = await getAvailability();
    if (status === 'unavailable') return false;

    _session = await LanguageModel.create({
      initialPrompts: [{ role: 'system', content: SYSTEM_PROMPT }],
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          onProgress?.(e.loaded, e.total);
        });
      },
    });
    return true;
  })().catch((err) => {
    console.error('[ai-comment-classifier] Initialization failed:', err);
    _initPromise = null;
    return false;
  });

  return _initPromise;
}

/**
 * Classifies a comment using the Prompt API with structured JSON output.
 *
 * @param {string} text - The comment text to classify.
 * @returns {Promise<{classification: 'Safe'|'Illegal'|'Harmful'|'Language', reason: string}>}
 */
export async function classifyComment(text) {
  if (!_session) {
    throw new Error('Classifier not initialized — call initClassifier() first.');
  }
  const raw = await _session.prompt(
    `Comment to review: ${JSON.stringify(text)}`,
    { responseConstraint: SCHEMA },
  );
  return JSON.parse(raw);
}
