var form = document.getElementById('form');
form.addEventListener('submit', function(ev) {
  ev.preventDefault();

  var formData = new FormData(form);
  var dateOfBirth = new Date(formData.get('dob'));
  var status = '';

  // Remove 'dob' from FormData if the user is <18.
  var date = new Date();
  date.setDate(date.getDate() - 365 * 18);
  if (Number(dateOfBirth) > Number(date)) {
    status = 'User is less than 18 years old!';
    formData.delete('dob');
    formData.set('underage', 'true');
  } else {
    status = 'User okay, name=`' + formData.get('name') + '`';
  }
  status += ', keys=' + Array.from(formData.keys());

  // This could be sent to a server with-
  //   window.fetch(url, {body: formData, method: 'POST'})

  ChromeSamples.setContent(document.createTextNode(status));
});
