(() => {
  let text = '';
  document.querySelectorAll('.preview').forEach((preview, i) => {
    if (i === 0) {
      return (text = preview.textContent);
    }
    preview.textContent = text;
  });
})();

const onChange = (e) => {
  const target = e.target;
  console.log(`🤖 ${target.id}: Value changed to "${target.value}".`);
  target.parentNode.querySelector('.preview').style.fontFamily = target.value;
};

document.querySelectorAll('font-select').forEach((fontSelect) => {
  fontSelect.disabled = fontSelect.disabled || !('queryLocalFonts' in self);
  fontSelect.insertAdjacentHTML(
    'beforebegin',
    `<pre><code>${fontSelect.outerHTML.replace(/</g, '&lt;')}</code></pre>`
  );
  fontSelect.addEventListener('change', onChange);
});
