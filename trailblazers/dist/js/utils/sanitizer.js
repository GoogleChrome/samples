/** @type {Promise<Object>|null} */
let domPurifyPromise = null;

/** @type {Sanitizer|null} */
let sanitizer = null;

/**
 * Sanitizes HTML content and injects it into a container element.
 * Tries to use the native Sanitizer API if available, otherwise falls back to DOMPurify.
 * @param {HTMLElement} container - The element to inject the sanitized HTML into.
 * @param {string} html - The raw HTML string to sanitize.
 * @return {Promise<void>}
 */
export async function sanitizeHTML(container, html) {
  const config = {
    // Native Sanitizer API
    allowProtocols: ['https', 'blob'],
    // DOMPurify
    ADD_ATTR: ['loading', 'decoding'],
    ADD_TAGS: ['figure', 'figcaption'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|ftp|blob|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i,
  };

  if ('setHTML' in container) {
    try {
      sanitizer = sanitizer || new Sanitizer(config);
      container.setHTML(html, { sanitizer });
      return;
    } catch (e) {
      console.error(e);
    }
  }

  if (!window.DOMPurify && !domPurifyPromise) {
    domPurifyPromise = (async () => {
      try {
        await import('/js/purify.min.js');
        return window.DOMPurify;
      } catch (e) {
        console.error('Failed to load DOMPurify', e);
        return null;
      }
    })();
  }

  const purify = window.DOMPurify || (await domPurifyPromise);
  if (purify && purify.sanitize) {
    container.innerHTML = purify.sanitize(html, config);
  } else {
    container.innerHTML = html;
  }
}
