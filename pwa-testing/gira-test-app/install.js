/* Custom Install */
let deferredPrompt;
const btnAdd = document.getElementById('butInstall');
const installContainer = document.getElementById('install');

// Handle install available
window.addEventListener('beforeinstallprompt', (e) => {
  showInstallPromo(e);
});

// Handle user request to install
btnAdd.addEventListener('click', (e) => {
  deferredPrompt.prompt();
});

// Hide the install button after app is installed
window.addEventListener('appinstalled', (evt) => {
  installContainer.classList.toggle('hidden', true);
  deferredPrompt = null;
});

// Show the install button when install is available
function showInstallPromo(e) {
  deferredPrompt = e;
  installContainer.classList.toggle('hidden', false);
}