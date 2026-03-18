/**
 * Shows a custom modal alert dialog.
 * @param {Object} ui - The UI elements.
 * @param {string} message - The message to display.
 * @return {Promise<void>}
 */
export async function customAlert(ui, message) {
  ui.alertMessage.textContent = message;
  ui.alertDialog.showModal();
  return new Promise((resolve) => {
    ui.alertDialog.addEventListener('close', () => resolve(), { once: true });
  });
}

/**
 * Shows a custom modal confirm dialog.
 * @param {Object} ui - The UI elements.
 * @param {string} message - The message to display.
 * @param {Object} [options={}] - Optional configuration.
 * @param {string} [options.confirmText] - Custom text for the confirm button.
 * @param {string} [options.cancelText] - Custom text for the cancel button.
 * @param {string} [options.confirmClass] - Custom CSS class for the confirm button.
 * @return {Promise<string>} The return value of the dialog.
 */
export async function customConfirm(ui, message, options = {}) {
  ui.confirmMessage.textContent = message;
  const confirmBtn = ui.confirmDialog.querySelector('button[value="confirm"]');
  const cancelBtn = ui.confirmDialog.querySelector('button[value="cancel"]');

  const originalConfirmText = confirmBtn.textContent;
  const originalCancelText = cancelBtn.textContent;
  const originalConfirmClass = confirmBtn.className;

  if (options.confirmText) {
    confirmBtn.textContent = options.confirmText;
  }
  if (options.cancelText) {
    cancelBtn.textContent = options.cancelText;
  }
  if (options.confirmClass) {
    confirmBtn.className = options.confirmClass;
  }

  ui.confirmDialog.showModal();
  return new Promise((resolve) => {
    ui.confirmDialog.addEventListener(
      'close',
      () => {
        const result = ui.confirmDialog.returnValue;
        confirmBtn.textContent = originalConfirmText;
        cancelBtn.textContent = originalCancelText;
        confirmBtn.className = originalConfirmClass;
        resolve(result);
      },
      { once: true },
    );
  });
}
