var template = document.getElementById('template');
var sentinel = document.getElementById('sentinel');

function loadItems(n) {
  for(var i = 0; i < n; i++) {
    var newItem = template.cloneNode(true);
    newItem.id = '';
    document.body.appendChild(newItem);
  }
}

var io = new IntersectionObserver(_ => {
  sentinel.parentNode.removeChild(sentinel);
  loadItems(10);
  document.body.appendChild(sentinel);
  loadItems(3);
});
io.observe(sentinel);
