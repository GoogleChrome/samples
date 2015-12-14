function performCopyEmail() {
  var emailLink = document.querySelector('.js-emaillink');

  var range = document.createRange();
  range.selectNode(emailLink);
  window.getSelection().addRange(range);

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    ChromeSamples.log('Copy email command was ' + msg);
  } catch (err) {
    ChromeSamples.log('execCommand Error', err);
  }
  window.getSelection().removeAllRanges();
}

function performCutTextarea() {
  var cutTextarea = document.querySelector('.js-cuttextarea');
  cutTextarea.select();

  try {
    var successful = document.execCommand('cut');
    var msg = successful ? 'successful' : 'unsuccessful';
    ChromeSamples.log('Cutting text command was ' + msg);
  } catch (err) {
    ChromeSamples.log('execCommand Error', err);
  }
}

// Get the buttons
var cutTextareaBtn = document.querySelector('.js-textareacutbtn');
var copyEmailBtn = document.querySelector('.js-emailcopybtn');

// Add click event listeners
copyEmailBtn.addEventListener('click', performCopyEmail);
cutTextareaBtn.addEventListener('click', performCutTextarea);

// The initial state should be disabled, and then enable based on
// queryCommandSupported. This is currently a bug: crbug.com/476508
// Set the initial state
/*
 cutTextareaBtn.disabled = !document.queryCommandSupported('cut');
 copyEmailBtn.disabled = !document.queryCommandSupported('copy');
*/
