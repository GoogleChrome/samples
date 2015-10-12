function logEscapedId(e) {
  ChromeSamples.log('My id is "' + e.target.id + '", and escaped id is "' +
                    CSS.escape(e.target.id) + '"');
}

var buttons = document.querySelectorAll('button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', logEscapedId);
}
