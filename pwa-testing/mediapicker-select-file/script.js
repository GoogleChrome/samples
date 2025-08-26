const typePrefix = "type_";

function createLabel(label, id, forElement) {
  let labelElement = document.createElement("label");
  labelElement.id = id;
  labelElement.textContent = label;
  if (forElement != null) labelElement.htmlFor = forElement.id;
  return labelElement;
}

function createImage(id, src, width) {
  let imgElement = document.createElement("img");
  imgElement.id = id;
  imgElement.src = src;
  imgElement.width = width;
  return imgElement;  
}

function populateCheckbox(div, id, label, acceptType) {
  let parent = document.createElement("div");
  parent.className = "checkboxDiv";
  
  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = (acceptType ? typePrefix + id : id);
  inputElement.name = id;
  inputElement.value = label;
  inputElement.addEventListener('click', checkboxUpdated);
  parent.appendChild(inputElement);
  
  parent.appendChild(createLabel(label, "label_" + id, inputElement));
  
  div.appendChild(parent);
}

function populateCheckBoxes() {
  console.log('populating images...');
  let div = document.getElementById("images");
  div.appendChild(createLabel("Images", "imgId", null));

  populateCheckbox(div, "jpeg", "image/jpeg", true);
  populateCheckbox(div, "png", "image/png", true);
  populateCheckbox(div, "gif", "image/gif", true);
  populateCheckbox(div, "bmp", "image/bmp", true);
  populateCheckbox(div, "allImages", "image/*", true);

  console.log('populating videos...');
  div = document.getElementById("videos");
  div.appendChild(createLabel("Videos", "videoId", null));
  populateCheckbox(div, "mp4", "video/mp4", true);
  populateCheckbox(div, "avi", "video/avi", true);
  populateCheckbox(div, "mov", "video/mov", true);
  populateCheckbox(div, "allVideos", "video/*", true);

  console.log('populating extensions...');
  div = document.getElementById("extensions");
  div.appendChild(createLabel("Extensions", "extId", null));
  populateCheckbox(div, "dot_jpg", ".jpg", true);
  populateCheckbox(div, "dot_png", ".png", true);
  populateCheckbox(div, "dot_mov", ".mov", true);
  populateCheckbox(div, "allExtensions", "*.*", true);
  
  console.log('populating others...');
  div = document.getElementById("others");
  div.appendChild(createLabel("Non-visual", "otherId", null));
  populateCheckbox(div, "binary", "application/octet-stream", true);
  populateCheckbox(div, "pdf", "application/pdf", true); 
  populateCheckbox(div, "allApplication", "application/*", true);
  populateCheckbox(div, "textPlain", "text/plain", true);
  populateCheckbox(div, "audio", "audio/*", true);
  populateCheckbox(div, "all", "*/*", true);
  
  console.log('populating actions...');
  div = document.getElementById("actions");
  div.appendChild(createLabel("Attributes", "attrId", null));
  populateCheckbox(div, "multiple", "Allow multiple", false);
  populateCheckbox(div, "capture", "Capture", false);
}

function checkboxUpdated(event) {
  // Prepare the Upload button, but don't add it yet
  let uploadElement = document.createElement("input");
  uploadElement.type = "file";
  uploadElement.id = "upload";

  //console.log('updated ', event.target, event.target.checked);
  let checkboxes = document.getElementsByTagName("input");
  let acceptTypes = "";
  for (let index in checkboxes) {
    let checkbox = checkboxes[index];
    if (checkbox == undefined || checkbox.id == undefined) continue;
    
    let prefix = checkbox.id.substring(0, 5);
    if (checkbox.checked) {
      if (typePrefix.localeCompare(prefix) == 0) {
        if (acceptTypes.length > 0) acceptTypes += ',';
        acceptTypes += checkboxes[index].value;        
      } else {
        console.log('action found ' + checkbox.id);
        uploadElement.setAttribute(checkbox.id, "");
      }
    }
  }
  uploadElement.setAttribute("accept", acceptTypes);
  uploadElement.addEventListener('change', onUpload);
  console.log(uploadElement);
  
  let uploadDiv = document.getElementById("upload");
  while (uploadDiv.lastElementChild) {
    uploadDiv.removeChild(uploadDiv.lastElementChild);
  }
      
  uploadDiv.appendChild(uploadElement);
}

function onUpload(event) {
  let uploadElement = document.getElementById('uploadElement');
  let results = document.getElementById('results');

  while (results.lastElementChild) {
    results.removeChild(results.lastElementChild);
  }
  
  let files = event.target.files; 
  if (files == null || files.length == 0) { console.log('no files'); return; }

  for (let i = 0; i < files.length; ++i) {
    //console.log(`File ${i+1}: ${files[i].name}`);
    let fileReader = new FileReader();
    let file = files[i];
    fileReader.readAsDataURL(file);
    fileReader.onload = (event) => {
      const dataUrl = event.target.result;
      results.appendChild (createImage("img" + i, dataUrl, 200));
    };
  }  
}