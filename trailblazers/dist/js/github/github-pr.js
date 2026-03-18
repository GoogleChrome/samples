import { generateMarkdown } from '../utils/markdown-utils.js';
import { customAlert } from '../utils/dialog-utils.js';
import { toBase64 } from '../utils/base64-utils.js';
import { ghFetch } from './github-api.js';
import { ensureAllTranslationsReady } from '../ai/ai-translator.js';
import { uploadDraftImages } from './github-utils.js';

/**
 * Creates a commit and a pull request on GitHub for the current draft.
 * @param {Object} ui - The UI elements containing GitHub configuration.
 * @param {Object} draft - The draft object to publish.
 * @return {Promise<void>}
 */
export async function createPR(ui, draft) {
  const { ghOwnerInput: owner, ghRepoInput: repo, ghTokenInput: token } = ui;
  if (!owner.value || !repo.value || !token.value) {
    customAlert(ui, 'Please fill in GitHub settings first.');
    ui.settingsDetails.open = true;
    if (!token.value) {
      token.focus();
    } else if (!owner.value) {
      owner.focus();
    } else if (!repo.value) {
      repo.focus();
    }
    return;
  }
  ui.githubPrBtn.disabled = true;
  ui.githubPrBtn.textContent = '⏳ Creating...';
  try {
    const { sync } = await import('../editor/create-post.js');
    await ensureAllTranslationsReady(ui, sync);

    const slug = ui.getSlug(ui.titleInput.value);
    const branchName = `post-${slug}-${Date.now()}`;
    const classifierResults = window.getSelectedClassifierResults
      ? window.getSelectedClassifierResults()
      : [];
    const md = generateMarkdown(
      draft,
      ui.titleInput.value,
      ui.descInput.value,
      ui.dateInput.value,
      ui.tagsInput.value,
      ui.contentInput.value,
      classifierResults,
    );

    const repoInfo = await ghFetch(ui, '');
    const defaultBranch = repoInfo.default_branch;
    const branchInfo = await ghFetch(ui, `/branches/${defaultBranch}`);
    const baseSha = branchInfo.commit.sha;

    await ghFetch(ui, '/git/refs', {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
    });

    const getSha = async (path) => {
      try {
        const file = await ghFetch(ui, `/contents/${path}?ref=${branchName}`);
        return file.sha;
      } catch (e) {
        return undefined;
      }
    };

    // Upload images
    const defaultLocale = window.DEFAULT_LOCALE || 'en';
    await uploadDraftImages(ui, draft, slug, branchName, defaultLocale, getSha);

    // Main post
    const mainPostPath = `content/${defaultLocale}/blog/${slug}/${slug}.md`;
    const existingMainPostSha = await getSha(mainPostPath);
    await ghFetch(ui, `/contents/${mainPostPath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `${existingMainPostSha ? 'Update' : 'Add'} post ${slug}`,
        content: toBase64(md),
        branch: branchName,
        sha: existingMainPostSha,
      }),
    });

    // Localized posts
    if (draft.translations) {
      for (const [locale, data] of Object.entries(draft.translations)) {
        const mdLocale = generateMarkdown(
          { ...draft, translations: undefined },
          data.title || ui.titleInput.value,
          data.description || ui.descInput.value,
          ui.dateInput.value,
          data.tags || ui.tagsInput.value,
          data.content,
          classifierResults,
        );
        const existingLocalePostSha = await getSha(data.path);
        await ghFetch(ui, `/contents/${data.path}`, {
          method: 'PUT',
          body: JSON.stringify({
            message: `${existingLocalePostSha ? 'Update' : 'Add'} ${locale} translation for ${slug}`,
            content: toBase64(mdLocale),
            branch: branchName,
            sha: existingLocalePostSha,
          }),
        });
      }
    }

    const pr = await ghFetch(ui, '/pulls', {
      method: 'POST',
      body: JSON.stringify({
        title: `${draft.sha ? 'Update' : 'Post'}: ${ui.titleInput.value}`,
        head: branchName,
        base: defaultBranch,
      }),
    });
    customAlert(ui, 'PR created successfully!');
    window.open(pr.html_url, '_blank');
  } catch (e) {
    console.error(e);
    customAlert(ui, `Failed to create PR: ${e.message}`);
  } finally {
    ui.githubPrBtn.disabled = false;
    ui.githubPrBtn.textContent = '🚀 Create PR';
  }
}
