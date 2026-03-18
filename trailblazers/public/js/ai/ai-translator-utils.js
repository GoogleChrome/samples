import { getMonitor } from './ai-features.js';

/**
 * Supported locales for translation.
 * Filters out the default locale from window.DEFAULT_LOCALE.
 * @return {Array<string>} The supported locales.
 */
export const getSupportedLocales = () => {
  const locales = window.APP_LOCALES || ['en', 'es', 'ja'];
  const defaultLocale = window.DEFAULT_LOCALE || 'en';
  const defaultBase = defaultLocale.split('-')[0];
  return locales.filter((l) => {
    const base = l.split('-')[0];
    return base !== defaultBase;
  });
};

/**
 * Generates options for the AI Translator.
 * @param {Object} ui - The UI elements.
 * @param {string} sourceLanguage - The source language code.
 * @param {string} targetLanguage - The target language code.
 * @return {Object} The translator options.
 */
export const getTranslatorOptions = (ui, sourceLanguage, targetLanguage) => ({
  sourceLanguage,
  targetLanguage,
  ...getMonitor(ui, targetLanguage, `Translator (${targetLanguage})`),
});

/**
 * Translates the alt attribute and figcaption of a <figure> or <img> tag.
 * @param {Object} translator - The translator instance.
 * @param {string} html - The original HTML block.
 * @return {Promise<string>} The HTML with translated text.
 */
export async function translateMediaAttributes(translator, html) {
  let result = html;

  // Robust regex for alt tags: handles internal quotes and multiline
  const altRegex = /alt=(?:"([^"]*)"|'([^']*)')/is;
  const altMatch = result.match(altRegex);

  if (altMatch) {
    const altText = altMatch[1] || altMatch[2];
    if (altText) {
      const translatedAlt = await translator.translate(altText);
      const matchedFullText = altMatch[0];
      const quote = matchedFullText.includes('"') ? '"' : "'";
      result = result.replace(
        matchedFullText,
        `alt=${quote}${translatedAlt}${quote}`,
      );
    }
  }

  // Translate figcaption if present
  const figMatch = result.match(/<figcaption>([\s\S]*?)<\/figcaption>/i);
  if (figMatch && figMatch[1]) {
    const figText = figMatch[1];
    const translatedFig = await translator.translate(figText);
    result = result.replace(
      figMatch[0],
      `<figcaption>${translatedFig}</figcaption>`,
    );
  }

  return result.trim();
}

/**
 * Translates metadata fields (title, description, tags).
 * @param {Object} translator - The translator instance.
 * @param {Object} metadata - Object containing title, description, and tags.
 * @return {Promise<Object>} The translated metadata.
 */
export async function translateMetadata(translator, metadata) {
  const result = { title: '', description: '', tags: '' };
  if (metadata.title) {
    result.title = (await translator.translate(metadata.title)).trim();
  }
  if (metadata.description) {
    result.description = (
      await translator.translate(metadata.description)
    ).trim();
  }
  if (metadata.tagsValue) {
    const tagsArr = metadata.tagsValue
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    const translatedTags = [];
    for (const tag of tagsArr) {
      translatedTags.push((await translator.translate(tag)).trim());
    }
    result.tags = translatedTags.join(', ');
  }
  return result;
}

/**
 * Translates a list of content blocks.
 * @param {Object} translator - The translator instance.
 * @param {Array<string>} blocks - The blocks to translate.
 * @return {Promise<string>} The translated content.
 */
export async function translateBlocks(translator, blocks) {
  let translatedContent = '';
  for (const block of blocks) {
    const trimmed = block.trim();
    if (trimmed.startsWith('<figure') || trimmed.startsWith('<img')) {
      translatedContent +=
        (await translateMediaAttributes(translator, block)) + '\n\n';
    } else {
      const stream = translator.translateStreaming(block);
      let blockResult = '';
      for await (const chunk of stream) {
        blockResult += chunk;
      }
      translatedContent += blockResult + '\n\n';
    }
  }
  return translatedContent.trim();
}
