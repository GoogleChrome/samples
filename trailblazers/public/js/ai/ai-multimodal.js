import { detectLanguage } from './ai-language-detection.js';
import { checkAIKeys } from './ai-config.js';

/** @type {Object} */
export const imageMetadataSchema = {
  type: 'object',
  properties: {
    alt: { type: 'string' },
    caption: { type: 'string' },
  },
  required: ['alt', 'caption'],
  additionalProperties: false,
};

/**
 * Generates alternative text and a caption for an image using the Language Model API.
 * @param {Blob|File|ImageBitmap} imageSource - The image to describe.
 * @param {Object} ui - The UI elements.
 * @return {Promise<Object|null>} The generated metadata or null if generation fails.
 */
export async function generateImageMetadata(imageSource, ui) {
  const enabled = localStorage.getItem('ai-features-enabled') === 'true';
  if (!enabled) {
    return null;
  }

  if (
    !('LanguageModel' in self) ||
    (await self.LanguageModel.availability({
      expectedInputs: [{ type: 'text', languages: ['en'] }, { type: 'image' }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
    }).catch(() => 'unavailable')) === 'unavailable'
  ) {
    await import('/js/prompt-api-polyfill.js');
  }

  if (typeof LanguageModel === 'undefined') {
    return null;
  }

  const isNative = LanguageModel.toString().includes('[native code]');
  if (!isNative && !checkAIKeys(ui)) {
    return null;
  }

  try {
    const lang = await detectLanguage(ui.contentInput.value || 'English');
    const options = {
      expectedInputs: [{ type: 'text', languages: [lang] }, { type: 'image' }],
      expectedOutputs: [{ type: 'text', languages: [lang] }],
      initialPrompts: [
        {
          role: 'system',
          content: `You are an expert at writing accessible alternative text and engaging captions for blog post images in ${lang}. Return a JSON object with "alt" and "caption" fields.`,
        },
      ],
    };

    // Check availability with EXACT same options as per SKILL.md
    const status = await LanguageModel.availability(options);
    if (status === 'unavailable') {
      return null;
    }

    const session = await LanguageModel.create(options);

    // Prompt structure as per SKILL.md for multimodal content
    let imageValue;
    let shouldClose = false;
    try {
      if (imageSource instanceof Blob && imageSource.type === 'image/svg+xml') {
        // SVGs must be drawn to a canvas to be rasterized for createImageBitmap
        const url = URL.createObjectURL(imageSource);
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 512;
          canvas.height = img.height || 512;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          imageValue = await createImageBitmap(canvas);
        } finally {
          URL.revokeObjectURL(url);
        }
      } else {
        imageValue = await createImageBitmap(imageSource);
      }
      shouldClose = true;
    } catch (e) {
      console.warn('createImageBitmap failed, falling back to Blob/Source', e);
      imageValue = imageSource;
    }

    try {
      const response = await session.prompt(
        [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                value:
                  'Describe this image for a blog post. Focus on a concise alt text for accessibility and a creative caption.',
              },
              { type: 'image', value: imageValue },
            ],
          },
        ],
        { responseConstraint: imageMetadataSchema },
      );

      return JSON.parse(response);
    } finally {
      if (shouldClose && imageValue.close) {
        imageValue.close();
      }
    }
  } catch (e) {
    console.warn('Multimodal AI metadata generation failed', e);
    return null;
  }
}
