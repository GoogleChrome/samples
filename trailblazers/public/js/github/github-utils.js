import { getImage } from '../utils/db-storage.js';
import { bufferToBase64 } from '../utils/base64-utils.js';
import { ghFetch } from './github-api.js';

/**
 * Uploads images and their localized copies to GitHub.
 * @param {Object} ui - The UI elements.
 * @param {Object} draft - The draft object.
 * @param {string} slug - The post slug.
 * @param {string} branchName - The target branch name.
 * @param {string} defaultLocale - The default locale.
 * @param {Function} getSha - Helper function to get contemporary SHA.
 * @return {Promise<void>}
 */
export async function uploadDraftImages(
  ui,
  draft,
  slug,
  branchName,
  defaultLocale,
  getSha,
) {
  for (const img of draft.imageFiles || []) {
    const data = await getImage(img.id);
    if (!data) continue;

    const content = await bufferToBase64(data);
    const imgPath = `content/${defaultLocale}/blog/${slug}/${img.name}`;
    const existingImgSha = await getSha(imgPath);

    await ghFetch(ui, `/contents/${imgPath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `${existingImgSha ? 'Update' : 'Add'} image ${img.name}`,
        content,
        branch: branchName,
        sha: existingImgSha,
      }),
    });

    // Redundant copies for each locale
    if (draft.translations) {
      for (const locale of Object.keys(draft.translations)) {
        const localeImgPath = `content/${locale}/blog/${slug}/${img.name}`;
        const existingLocaleImgSha = await getSha(localeImgPath);
        await ghFetch(ui, `/contents/${localeImgPath}`, {
          method: 'PUT',
          body: JSON.stringify({
            message: `${existingLocaleImgSha ? 'Update' : 'Add'} localized image ${img.name} for ${locale}`,
            content,
            branch: branchName,
            sha: existingLocaleImgSha,
          }),
        });
      }
    }
  }
}
