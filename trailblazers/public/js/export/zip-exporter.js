import { fileSave } from 'browser-fs-access';
import { getImage } from '../utils/db-storage.js';
import { generateMarkdown } from '../utils/markdown-utils.js';

/**
 * Generates and downloads a ZIP archive containing the post Markdown and images.
 * @param {Object} draft - The draft object.
 * @param {string} title - The post title.
 * @param {string} description - The post description.
 * @param {string} date - The post date.
 * @param {string} tagsValue - Comma-separated tags string.
 * @param {string} content - The post content.
 * @param {Array<Object>} [classifierResults=[]] - AI classifier results.
 * @return {Promise<void>}
 */
export async function downloadZIP(
  draft,
  title,
  description,
  date,
  tagsValue,
  content,
  classifierResults = [],
) {
  if (!draft) {
    throw new Error('No draft data provided for ZIP export.');
  }
  const slug = (title || 'untitled')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
  const md = generateMarkdown(
    draft,
    title,
    description,
    date,
    tagsValue,
    content,
    classifierResults,
  );

  const zip = new JSZip();
  const defaultLocale = window.DEFAULT_LOCALE || 'en';
  const folder = zip.folder(`content/${defaultLocale}/blog/${slug}`);

  folder.file(`${slug}.md`, md);

  if (draft.imageFiles && draft.imageFiles.length > 0) {
    for (const img of draft.imageFiles) {
      const data = await getImage(img.id);
      if (data) {
        folder.file(img.name, data);
        // Redundant copies for each locale
        if (draft.translations) {
          for (const locale of Object.keys(draft.translations)) {
            const localeFolder = zip.folder(`content/${locale}/blog/${slug}`);
            localeFolder.file(img.name, data);
          }
        }
      }
    }
  }

  // Add localized markdown files
  if (draft.translations) {
    for (const [locale, data] of Object.entries(draft.translations)) {
      const mdLocale = generateMarkdown(
        { ...draft, translations: undefined },
        data.title || title,
        data.description || description,
        date,
        data.tags || tagsValue,
        data.content,
        classifierResults,
      );
      zip.file(data.path, mdLocale);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  await fileSave(blob, {
    fileName: `${slug}.zip`,
    extensions: ['.zip'],
    description: 'Blog ZIP Archive',
  });
}
