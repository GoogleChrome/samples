/* global ResizeObserver */

const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    if (entry.contentRect.width < 250) {
      entry.target.style.border = '3px solid red';
    } else {
      entry.target.style.border = 'none';
    }
  }
});
// Only observe the green box (which is the third box).
ro.observe(document.querySelector('.box:nth-child(3)'));
