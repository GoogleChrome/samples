const fullscreenButton = document.querySelector('.fullscreen');
const fullscreenKeyboardLockButton = document.querySelector(
  '.fullscreen-keyboard-lock'
);
const showButton = document.getElementById('showDialog');
const showButton2 = document.getElementById('showDialog2');
const favDialog = document.getElementById('favDialog');
const outputBox = document.querySelector('output');
const selectEl = favDialog.querySelector('select');
const confirmBtn = favDialog.querySelector('#confirmBtn');

const supportsKeyboardLock =
  'keyboard' in navigator && 'lock' in navigator.keyboard;

const fullscreen = async () => {
  try {
    await document.documentElement.requestFullscreen();
  } catch (err) {
    alert(`${err.name}: ${err.message}`);
  }
};

fullscreenButton.addEventListener('click', async () => {
  await fullscreen();
});

fullscreenKeyboardLockButton.addEventListener('click', async () => {
  if (supportsKeyboardLock) {
    await navigator.keyboard.lock(['Escape']);
    console.log('Keyboard locked.');
  }
  await fullscreen();
});

// "Show the dialog" button opens the <dialog> modally
showButton.addEventListener('click', () => {
  favDialog.showModal();
});

showButton2.addEventListener('click', () => {
  favDialog.showModal();
});

// "Favorite animal" input sets the value of the submit button
selectEl.addEventListener('change', (e) => {
  confirmBtn.value = selectEl.value;
});

// "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
favDialog.addEventListener('close', (e) => {
  outputBox.value =
    favDialog.returnValue === 'default'
      ? 'No return value.'
      : `Return value: ${favDialog.returnValue}.`; // Have to check for "default" rather than empty string
});

// Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
confirmBtn.addEventListener('click', (event) => {
  event.preventDefault(); // We don't want to submit this fake form
  favDialog.close(selectEl.value); // Have to send the select box value here.
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && supportsKeyboardLock) {
    navigator.keyboard.unlock();
    console.log('Keyboard unlocked.');
  }
});
