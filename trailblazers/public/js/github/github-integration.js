import { GH_CONFIG_KEY } from './github-api.js';

export { ghFetch } from './github-api.js';
export { createPR } from './github-pr.js';
export { loadPostFromGitHub } from './github-loader.js';

/**
 * Initializes the GitHub synchronization UI by loading settings from localStorage
 * and setting up input listeners.
 * @param {Object} ui - The UI elements.
 */
export function initGitHubSync(ui) {
  const config = JSON.parse(localStorage.getItem(GH_CONFIG_KEY) || '{}');

  ['gh-token', 'gh-owner', 'gh-repo'].forEach((id) => {
    const key = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Input';
    const input = ui[key];
    if (!input) {
      return;
    }

    let value = config[id] || localStorage.getItem(id);
    if (!value && id === 'gh-token') {
      value = window.FIREBASE_CONFIG?.github_pat;
    }

    input.value = value || '';

    input.oninput = () => {
      const currentConfig = JSON.parse(
        localStorage.getItem(GH_CONFIG_KEY) || '{}',
      );
      currentConfig[id] = input.value;
      localStorage.setItem(GH_CONFIG_KEY, JSON.stringify(currentConfig));
    };
  });
}
