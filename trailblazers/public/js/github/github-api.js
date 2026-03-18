/** @type {string} */
export const GH_CONFIG_KEY = 'gh-config';

/**
 * Performs a fetch request to the GitHub API.
 * @param {Object} ui - The UI elements containing GitHub configuration.
 * @param {string} path - The API endpoint path or full URL.
 * @param {Object} [options={}] - Optional request configuration.
 * @return {Promise<Object>} The JSON response.
 * @throws {Error} If the response is not OK.
 */
export async function ghFetch(ui, path, options = {}) {
  const url = path.startsWith('https://')
    ? path
    : `https://api.github.com/repos/${ui.ghOwnerInput.value}/${ui.ghRepoInput.value}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `token ${ui.ghTokenInput.value}`,
      Accept: 'application/vnd.github.v3+json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    let err;
    try {
      err = JSON.parse(txt);
    } catch (e) {
      err = { message: txt };
    }
    throw new Error(err.message || res.statusText);
  }
  return res.json();
}
