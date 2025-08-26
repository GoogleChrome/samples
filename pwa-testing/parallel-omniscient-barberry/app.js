import { makeFileEditor } from "/file-editor.js";
import("/check-state.js");

// Redirect to https if using http, because File System Access API (previously Native FileSystem API) isn't supported in http.
if (location.protocol !== "https:") {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`
  );
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}

const openedFilesContainer = document.getElementById(
  "opened-editors-container"
);
const addFileEditor = async (file, path, deleteHandler) => {
  const editor = await makeFileEditor(file, path, deleteHandler);
  openedFilesContainer.appendChild(editor);
};

const addDirectory = async (directory, path) => {
  const fullPath = path ? `${path}/${directory.name}` : directory.name;

  for await (const entry of directory.getEntries()) {
    if (entry.isFile) {
      const removeFunc = (name) => {
        directory.removeEntry(name);
      };
      await addFileEditor(entry, fullPath, removeFunc);
    } else {
      await addDirectory(entry, fullPath);
    }
  }
};

// Hook up the open files button.
const openFileButton = document.getElementById("open-files-button");
openFileButton.addEventListener("click", async () => {
  let files = await window.showOpenFilePicker({ multiple: true });
  files = Array.isArray(files) ? files : [files];

  for (const file of files) {
    await addFileEditor(file);
  }
});

function removeParamFromUrl(paramName) {
  let searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has(paramName)) {
    return;
  }
  searchParams.delete(paramName);
  let searchString = searchParams.toString().length > 0 ? '?' + searchParams.toString() : '';
  let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname +  searchString + window.location.hash;
  history.replaceState(null, '', newUrl);
}

// Hook up the open folder button.
const openFolderButton = document.getElementById("open-folder-button");
openFolderButton.addEventListener("click", async () => {
  const directory = await window.showDirectoryPicker();
  console.log(directory);
  await addDirectory(directory);
});

if ("launchQueue" in window) {
  window.launchQueue.setConsumer(async (launchParams) => {
    console.log("Launched with: ", launchParams);
    const editorsContainer = document.getElementById("editors-container");
    if (!launchParams.files.length) {
      editorsContainer.innerText =
        "Oh poo, no files. Consider granting the permission next time!";
      return;
    }
    // Allow reloading support (not implemented yet, currently supported
    // by Chromium's re-adding lauchParams to queue on reload).
    removeParamFromUrl("first_launch");
    
    if (window.location.search.startsWith("?plaintext")) {
      for (const launchFile of launchParams.files) {
        const editor = await makeFileEditor(launchFile);
        editorsContainer.appendChild(editor);
      }
    } else if (window.location.search.startsWith("?image")) {
      if (launchParams.files.length != 1) {
        editorsContainer.innerText =
          "Oh poo, too many images. I'm taking a nap!";
        return;
      }

      let canvasView = document.getElementById("image-view");
      const fileContents = await launchParams.files[0].getFile();
      const imageBitmap = await createImageBitmap(fileContents);
      canvasView.width = imageBitmap.width;
            canvasView.height = imageBitmap.height;
      canvasView.getContext('2d').drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);
      canvasView.hidden = false;
    } else {
      editorsContainer.innerText = "Launched with wrong `action_url`!";
    }
  });
}

const findSupportedTypes = async () => {
  const response = await fetch("manifest.json");
  const json = await response.json();

  if (!json.file_handlers) return;

  const mimelist = document.getElementById("manifest-types-mime-list");
  const extlist = document.getElementById("manifest-types-extension-list");
  for (const handler of json.file_handlers) {
    for (const [mime, fileexts] of Object.entries(handler.accept)) {
      const item = document.createElement("li");
      item.innerHTML = `${mime}`;
      mimelist.appendChild(item);

      console.log(fileexts);
      if (typeof fileexts == "string") {
        const extitem = document.createElement("li");
        extitem.innerHTML = `${fileexts}`;
        extlist.appendChild(extitem);
      } else {
        for (const ext of fileexts) {
          const extitem = document.createElement("li");
          extitem.innerHTML = `${ext}`;
          extlist.appendChild(extitem);
        }
      }
    }
  }

  const checkState = await import("/check-state.js");
  checkState.show("manifest-types-mime");
  checkState.show("manifest-types-extension");
};

findSupportedTypes();

/*
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});
*/
