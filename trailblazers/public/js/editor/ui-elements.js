/**
 * Object containing references to all major UI elements in the editor.
 */
export const ui = {
  draftsListEl: document.getElementById('drafts-list'),
  newDraftBtn: document.getElementById('new-draft-btn'),
  loadDraftBtn: document.getElementById('load-draft-btn'),
  titleInput: document.getElementById('post-title'),
  aiSuggestTitleBtn: document.getElementById('ai-suggest-title-btn'),
  descInput: document.getElementById('post-description'),
  aiSuggestDescriptionBtn: document.getElementById(
    'ai-suggest-description-btn',
  ),
  dateInput: document.getElementById('post-date'),
  tagsInput: document.getElementById('post-tags'),
  tagPills: document.getElementById('tag-pills'),
  tagInput: document.getElementById('tag-input'),
  aiSuggestTagsBtn: document.getElementById('ai-suggest-tags-btn'),
  contentInput: document.getElementById('post-content'),
  previewContent: document.getElementById('preview-content'),
  copyBtn: document.getElementById('copy-btn'),
  downloadBtn: document.getElementById('download-btn'),
  dropZone: document.getElementById('drop-zone'),
  fileInput: document.getElementById('file-input'),
  uploadBtn: document.getElementById('upload-btn'),
  aiStatus: document.getElementById('ai-status'),
  aiDownloadProgress: document.getElementById('ai-download-progress'),
  aiStatusText: document.getElementById('ai-status-text'),
  aiWriterInput: document.getElementById('ai-writer-input'),
  aiWriterBtn: document.getElementById('ai-writer-btn'),
  aiRewriterTone: document.getElementById('ai-rewriter-tone'),
  aiRewriterLength: document.getElementById('ai-rewriter-length'),
  aiRewriterBtn: document.getElementById('ai-rewriter-btn'),
  aiClassifierBtn: document.getElementById('ai-classifier-btn'),
  aiClassifierResults: document.getElementById('ai-classifier-results'),
  aiFeaturesToggle: document.getElementById('ai-features-toggle'),
  aiOnlyExistingTagsToggle: document.getElementById(
    'ai-only-existing-tags-toggle',
  ),
  aiKeysSection: document.getElementById('ai-keys-section'),
  aiBackendSelect: document.getElementById('ai-backend'),
  aiApiKeyInput: document.getElementById('ai-api-key'),
  aiModelNameInput: document.getElementById('ai-model-name'),
  aiProjectIdInput: document.getElementById('ai-project-id'),
  aiAppIdInput: document.getElementById('ai-app-id'),
  aiGeminiApiProviderSelect: document.getElementById('ai-gemini-api-provider'),
  aiUseAppCheckToggle: document.getElementById('ai-use-app-check'),
  aiAppCheckFields: document.getElementById('ai-app-check-fields'),
  aiRecaptchaSiteKeyInput: document.getElementById('ai-recaptcha-site-key'),
  aiUseLimitedUseTokensToggle: document.getElementById(
    'ai-use-limited-use-tokens',
  ),
  aiDeviceSelect: document.getElementById('ai-device'),
  aiDtypeSelect: document.getElementById('ai-dtype'),
  settingsDetails: document.querySelector('.settings-details'),
  aiWriterSection: document.querySelector('.ai-writer-section'),
  aiRewriterSection: document.querySelector('.ai-rewriter-section'),
  aiClassifierSection: document.querySelector('.ai-classifier-section'),
  aiTranslationSection: document.querySelector('.ai-translation-section'),
  aiTranslateToggle: document.getElementById('ai-translate-toggle'),
  aiTranslationLocalesContainer: document.getElementById(
    'ai-translation-locales-container',
  ),
  aiTranslationsContainer: document.getElementById('ai-translations-container'),
  aiTranslateAllBtn: document.getElementById('ai-translate-all-btn'),
  alertDialog: document.getElementById('alert-dialog'),
  alertMessage: document.getElementById('alert-message'),
  confirmDialog: document.getElementById('confirm-dialog'),
  confirmMessage: document.getElementById('confirm-message'),
  ghTokenInput: document.getElementById('gh-token'),
  ghOwnerInput: document.getElementById('gh-owner'),
  ghRepoInput: document.getElementById('gh-repo'),
  githubPrBtn: document.getElementById('github-pr-btn'),
  saveSettingsBtn: document.getElementById('save-settings-btn'),
  loadSettingsBtn: document.getElementById('load-settings-btn'),
  activeAiStreams: 0,
  getTags: () =>
    ui.tagsInput.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && t !== 'posts'),
  getSlug: (title) =>
    (title || 'untitled')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, ''),
};
