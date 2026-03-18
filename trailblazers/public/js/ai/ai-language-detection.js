/**
 * Detects the language of a given text using the Language Detector API.
 * @param {string} text - The text to detect the language for.
 * @return {Promise<string>} The detected language code (defaults to 'en').
 */
export async function detectLanguage(text) {
  if (
    !('LanguageDetector' in self) ||
    (await self.LanguageDetector.availability({
      expectedInputLanguages: ['en'],
    }).catch(() => 'unavailable')) === 'unavailable'
  ) {
    await import('/js/task-apis/language-detector.js');
  }

  if (typeof LanguageDetector === 'undefined') {
    return 'en';
  }

  try {
    const options = {};
    const status = await LanguageDetector.availability(options);
    if (status === 'unavailable') {
      return 'en';
    }

    const detector = await LanguageDetector.create(options);
    const results = await detector.detect(text);

    return results.length > 0 ? results[0].detectedLanguage : 'en';
  } catch (e) {
    console.warn('Language detection failed', e);
    return 'en';
  }
}
