(async () => {
  // Feature Detection
  // If the browser prototype has the 'switch' property, we trust native support.
  if ('switch' in HTMLInputElement.prototype) {
    return;
  }

  const contrastMediaQueryList = matchMedia('(prefers-contrast: more)');
  let prefersContrastMore = contrastMediaQueryList.matches;
  contrastMediaQueryList.addEventListener('change', (event) => {
    prefersContrastMore = event.matches;
  });

  const sheetPromise = fetch(import.meta.resolve('./input-switch-polyfill.css'))
    .then((r) => r.text())
    .then((css) => new CSSStyleSheet().replace(css));

  const supportsColorMix = CSS.supports('color: color-mix(in srgb, red, blue)');

  // Helper to upgrade a single checkbox
  function upgradeSwitch(input) {
    // Avoid double-processing
    if (input.classList.contains('switch')) {
      return;
    }

    // Apply the class that triggers our CSS
    input.classList.add('switch');

    // Set the ARIA role
    input.setAttribute('role', 'switch');

    // Handle `accent-color` and `writing-mode` support
    // We read the computed accent-color (inherited or set explicitly)
    // and assign it to the CSS variable --switch-accent
    const style = getComputedStyle(input);
    const { 'accent-color': accentColor, 'writing-mode': writingMode } = style;
    if (writingMode) {
      input.classList.add(writingMode);
    }
    if (accentColor && accentColor !== 'auto') {
      input.style.setProperty('--switch-accent', accentColor);
    }

    // Drag support
    input.addEventListener('pointerdown', (event) => {
      if (input.disabled) {
        return;
      }
      // Don't preventDefault here to allow native focus and click if we don't drag

      const target = input;
      target.setPointerCapture(event.pointerId);

      const startX = event.clientX;
      const startY = event.clientY;
      const wasChecked = target.checked;
      const style = getComputedStyle(target);
      const fontSize = parseFloat(style.fontSize);

      // Determine orientation
      const isRtl = style.direction === 'rtl';
      const isVertical =
        target.classList.contains('vertical-rl') ||
        target.classList.contains('vertical-lr') ||
        target.classList.contains('sideways-rl');
      const isSidewaysLr = target.classList.contains('sideways-lr');

      let currentProgress = wasChecked ? 1 : 0;
      let isDragging = false;

      const handlePointerMove = (e) => {
        if (!target.hasPointerCapture(e.pointerId)) {
          return;
        }

        // Check for drag threshold
        if (!isDragging) {
          if (
            Math.abs(e.clientX - startX) > 5 ||
            Math.abs(e.clientY - startY) > 5
          ) {
            isDragging = true;
            target.style.transition = 'none';
          } else {
            return; // Treat as click until moved enough
          }
        }

        e.preventDefault(); // Prevent native scrolling/selection during drag

        let delta = 0;
        if (isVertical) {
          delta = e.clientY - startY;
        } else if (isSidewaysLr) {
          delta = -(e.clientY - startY);
        } else {
          delta = e.clientX - startX;
          if (isRtl) {
            delta = -delta;
          }
        }

        const progressChange = delta / fontSize;
        let newProgress = (wasChecked ? 1 : 0) + progressChange;
        newProgress = Math.max(0, Math.min(1, newProgress));
        currentProgress = newProgress;

        const offset = (2 * newProgress - 1) * fontSize;
        const isVisuallyOn = newProgress > 0.5;

        // Update styles
        if (isVisuallyOn) {
          target.classList.add('visually-on');
          target.classList.remove('visually-off');
          if (supportsColorMix) {
            target.style.boxShadow = `inset ${offset}px 0px 0px 0px color-mix(in srgb, var(--switch-accent), transparent 50%)`;
          } else {
            target.style.boxShadow = `inset ${offset}px 0px 0px 0px var(--switch-accent)`;
          }
          target.style.border = `1px solid ${prefersContrastMore ? 'ButtonText' : 'var(--switch-accent)'}`;
        } else {
          target.classList.add('visually-off');
          target.classList.remove('visually-on');
          target.style.boxShadow = `inset ${offset}px 0px 0px 0px rgba(192, 192, 192, 1)`;
          target.style.border = `1px solid ${prefersContrastMore ? 'ButtonText' : 'rgba(192, 192, 192, 1)'}`;
        }
      };

      const handlePointerUp = (e) => {
        target.releasePointerCapture(e.pointerId);
        target.removeEventListener('pointermove', handlePointerMove);
        target.removeEventListener('pointerup', handlePointerUp);
        target.removeEventListener('pointercancel', handlePointerUp);

        target.style.transition = '';
        target.style.boxShadow = '';
        target.style.border = '';
        target.classList.remove('visually-on');
        target.classList.remove('visually-off');

        if (isDragging) {
          const finalChecked = currentProgress > 0.5;
          if (finalChecked !== wasChecked) {
            target.checked = finalChecked;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            target.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // Suppress the subsequent click event since we handled the drag
          target.addEventListener(
            'click',
            (clickEvent) => {
              clickEvent.preventDefault();
              clickEvent.stopPropagation();
            },
            { once: true, capture: true }
          );
        }
      };

      target.addEventListener('pointermove', handlePointerMove);
      target.addEventListener('pointerup', handlePointerUp);
      target.addEventListener('pointercancel', handlePointerUp);
    });
  }

  // Initial Run
  async function init() {
    const switches = document.querySelectorAll(
      'input[type="checkbox"][switch]'
    );
    switches.forEach(upgradeSwitch);
    const newSheet = await sheetPromise;
    if (!document.adoptedStyleSheets.includes(newSheet)) {
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, newSheet];
    }
  }

  // Observer for dynamic content (SPAs, HTMX, etc.)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            // Check the node itself
            if (
              node.matches &&
              node.matches('input[type="checkbox"][switch]')
            ) {
              upgradeSwitch(node);
            }
            // Check descendants
            const nestedSwitches = node.querySelectorAll
              ? node.querySelectorAll('input[type="checkbox"][switch]')
              : [];
            nestedSwitches.forEach(upgradeSwitch);
          }
        });
      }
    });
  });

  // Start logic
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    init();
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
