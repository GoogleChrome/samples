/* global IntersectionObserver */
var scroller = document.querySelector('#scroller');
var sentinel = document.querySelector('#sentinel');
var counter = 1;

function loadItems(n) {
  for (var i = 0; i < n; i++) {
    var newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.textContent = 'Item ' + counter++;
    scroller.appendChild(newItem);
  }
}

var intersectionObserver = new IntersectionObserver(entries => {
  // If the browser is busy while scrolling happens, multiple entries can
  // accumulate between invocations of this callback, so we loop over
  // them.
  entries.forEach(entry => {
    // If intersectionRatio is 0, the sentinel is out of view
    // and we do not need to do anything.
    if (entry.intersectionRatio > 0) {
      loadItems(10);
      // appendChild will move the existing element, so there is no need to
      // remove it first.
      scroller.appendChild(sentinel);
      loadItems(5);
      ChromeSamples.setStatus('Loaded up to item ' + counter);

      // We have already loaded more content, no need to look at any more
      // entries.
      return;
    }
  });
});
intersectionObserver.observe(sentinel);
