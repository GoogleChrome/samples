/**
 * Removes the 'hide' attribute from an element or list of elements.
 **/
export const show = (ids, hide = false) => {
  ids = Array.isArray(ids) ? ids : [ids];

  for (const id of ids) {
    const element = document.getElementById(id);

    if (!hide) element.classList.remove("hide");
    else element.classList.add("hide");
  }
};

const dontHideIf = (id, condition) => show(id, !condition);
const hideIf = (id, condition) => show(id, condition);

const fileHandlingEnabled = "launchQueue" in window;
const nativeFileSystemEnabled = "showOpenFilePicker" in window;

dontHideIf("launch-files", fileHandlingEnabled);
dontHideIf("opened-files", nativeFileSystemEnabled);

hideIf("file-handling-problem", fileHandlingEnabled);
hideIf("file-system-problem", nativeFileSystemEnabled);

// Only show the problems section if there is a problem.
dontHideIf("problems", !fileHandlingEnabled || !nativeFileSystemEnabled);
