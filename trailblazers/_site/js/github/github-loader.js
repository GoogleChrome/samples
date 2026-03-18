import { fromBase64 } from '../utils/base64-utils.js';
import { ghFetch } from './github-api.js';

/**
 * Loads a blog post and its associated images from GitHub.
 * @param {Object} ui - The UI elements containing GitHub configuration.
 * @param {string} path - The path to the post file on GitHub.
 * @return {Promise<Object>} The post data, including content and images.
 * @throws {Error} If GitHub settings are missing or fetch fails.
 */
export async function loadPostFromGitHub(ui, path) {
  const { ghOwnerInput: owner, ghRepoInput: repo, ghTokenInput: token } = ui;
  if (!owner.value || !repo.value || !token.value) {
    throw new Error('Please fill in GitHub settings first.');
  }

  const cleanPath = path.startsWith('./') ? path.substring(2) : path;
  try {
    const file = await ghFetch(ui, `/contents/${cleanPath}`);
    const content = fromBase64(file.content);
    const sha = file.sha;

    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      return { content, sha, path: cleanPath };
    }

    const frontMatter = match[1];
    const body = match[2];
    const data = {};
    frontMatter.split('\n').forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        return;
      }
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .substring(1, value.length - 1)
          .split(',')
          .map((t) => t.trim().replace(/^["']|["']$/g, ''));
      }
      data[key] = value;
    });

    const dirPath = cleanPath.substring(0, cleanPath.lastIndexOf('/'));
    const images = [];
    try {
      const dirContents = await ghFetch(ui, `/contents/${dirPath}`);
      const imageFiles = dirContents.filter(
        (f) => f.type === 'file' && /\.(jpe?g|png|gif|webp|svg)$/i.test(f.name),
      );
      for (const imgFile of imageFiles) {
        const imgData = await ghFetch(ui, `/contents/${imgFile.path}`);
        images.push({
          name: imgFile.name,
          sha: imgFile.sha,
          content: imgData.content,
          path: imgFile.path,
        });
      }
    } catch (e) {
      console.warn('Could not fetch images', e);
    }

    return {
      title: data.title,
      description: data.description,
      date: data.date,
      tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
      ad_categories: data.ad_categories,
      ad_confidences: data.ad_confidences,
      content: body.trim(),
      sha,
      path: cleanPath,
      images,
    };
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to load post from GitHub: ${e.message}`);
  }
}
