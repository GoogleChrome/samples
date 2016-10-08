/* global ResizeObserver */

const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.classList.toggle('stripes', entry.contentRect.width < 250);
  }
});
// Only observe the green box (which is the third box).
ro.observe(document.querySelector('.box:nth-child(2)'));
