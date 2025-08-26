const template = document.getElementById("file-editor-template");

export const makeFileEditor = async (forFile, path, deleteHandler) => {
  const readHandle = await forFile.getFile();
  const writeHandle = forFile.createWritable ? forFile : undefined;

  const fullName = path ? `${path}/${readHandle.name}` : readHandle.name;
  const element = template.content.cloneNode(true);
  const nameContainer = element.querySelector("[name='file-name']");
  nameContainer.innerText = fullName;

  const contentContainer = element.querySelector("[name='file-contents']");
  contentContainer.innerText = "Loading...";

  const saveButton = element.querySelector("[name='save-button']");
  saveButton.addEventListener("click", async () => {
    const writable = await writeHandle.createWritable();
    await writable.write(contentContainer.value);
    await writable.close();
  });

  const deleteButton = element.querySelector("[name='delete-button']");
  if (!deleteHandler) deleteButton.classList.add("hide");
  else
    deleteButton.addEventListener("click", async () => {
      try {
        await deleteHandler(readHandle.name);
      } catch (err) {
        console.log(`Couldn't delete file at ${fullName}: ${err}`);
        alert(`Couldn't delete file at ${fullName}`);
      }
    });

  // If we don't have a write handle, don't show a save button.
  if (!writeHandle) saveButton.classList.add("hide");

  // Asynchronously load in the file contents.
  try {
    contentContainer.value = await readHandle.text();
  } catch (err) {
    console.log(`Failed to load contents for file: ${readHandle.name}`, err);
  }

  return element;
};
