const butReq = document.getElementById('butRequest');
butReq.addEventListener('click', getContacts);

const cbMultiple = document.getElementById('multiple');
const cbName = document.getElementById('name');
const cbEmail = document.getElementById('email');
const cbTel = document.getElementById('tel');
const ulResults = document.getElementById('results');
const preResults = document.getElementById('rawResults');

const supported = ('contacts' in navigator && 'ContactsManager' in window);

if (supported) {
  const divNotSupported = document.getElementById('notSupported');
  divNotSupported.classList.toggle('hidden', true);
  butReq.removeAttribute('disabled');
}

async function getContacts() {
  const props = [];
  if (cbName.checked) props.push('name');
  if (cbEmail.checked) props.push('email');
  if (cbTel.checked) props.push('tel');

  const opts = {multiple: cbMultiple.checked};

  try {
    const contacts = await navigator.contacts.select(props, opts);
    handleResults(contacts);
  } catch (ex) {
    ulResults.classList.toggle('error', true);
    ulResults.classList.toggle('success', false);
    ulResults.innerText = ex.toString();
  }

}

function handleResults(contacts) {
  ulResults.classList.toggle('success', true);
  ulResults.classList.toggle('error', false);
  ulResults.innerHTML = '';
  renderResults(contacts);
}

function renderResults(contacts) {

  contacts.forEach((contact) => {
    const lines = [];
    if (contact.name) lines.push(`<b>Name:</b> ${contact.name.join(', ')}`);
    if (contact.email) lines.push(`<b>E-mail:</b> ${contact.email.join(', ')}`);
    if (contact.tel) lines.push(`<b>Telephone:</b> ${contact.tel.join(', ')}`);
    lines.push(`<b>Raw:</b> <code>${JSON.stringify(contact)}</code>`);
    const li = document.createElement('li');
    li.innerHTML = lines.join('<br>');
    ulResults.appendChild(li);
  });
  const strContacts = JSON.stringify(contacts, null, 2);
  console.log(strContacts);
}
