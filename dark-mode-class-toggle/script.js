import 'https://googlechromelabs.github.io/dark-mode-toggle/src/dark-mode-toggle.mjs';

const toggle = document.querySelector('dark-mode-toggle');
const body = document.body;

// Set or remove the `dark` class the first time.
toggle.mode === 'dark' ? body.classList.add('dark') : body.classList.remove('dark');

// Listen for toggle changes (which includes `prefers-color-scheme` changes)
// and toggle the `dark` class accordingly.
toggle.addEventListener('colorschemechange', () => {
  body.classList.toggle('dark', toggle.mode === 'dark');
});