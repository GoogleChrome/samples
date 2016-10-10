/* global ResizeObserver */

const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.style.borderRadius = Math.max(0, 250 - entry.contentRect.width) + 'px';
  }
});
// Only observe the 2nd box
ro.observe(document.querySelector('.box:nth-child(2)'));
