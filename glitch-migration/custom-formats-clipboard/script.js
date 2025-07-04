const copyButton = document.querySelector(".copy");
const pasteButton = document.querySelector(".paste");
const pre = document.querySelector("pre");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let blobs;

const IMG_URL = "./image.avif";

const toBlob = async (type) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const newImg = document.createElement("img");
      const blobURL = URL.createObjectURL(blob);
      newImg.addEventListener("load", () => {
        URL.revokeObjectURL(blobURL);
      });
      newImg.src = blobURL;
      document.body.append(newImg);
      document.body.append(
        document.createTextNode(`Re-encoded image as ${blob.type}`)
      );
      resolve(blob);
    }, type);
  });
};

const img = document.createElement("img");
img.crossOrigin = "anonymous";
img.addEventListener("load", async () => {
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
  copyButton.style.display = "block";
  blobs = await Promise.all(
    ["image/jpeg", "image/webp", "image/png"].map(toBlob)
  );
});
img.src = IMG_URL;

copyButton.addEventListener("click", async () => {
  try {
    const data = {};
    blobs.forEach((blob) => {
      data[`${blob.type !== "image/png" ? "web " : ""}${blob.type}`] = blob;
    });
    await navigator.clipboard.write([new window.ClipboardItem(data)]);
    pasteButton.style.display = "block";
    pasteButton.disabled = false;
  } catch (err) {
    console.error(err.name, err.message);
    pre.style.display = "block";
    pre.textContent = `${err.name}: ${err.message}`;
  }
});

pasteButton.addEventListener("click", async () => {
  const items = await navigator.clipboard.read();
  for (const item of items) {
    console.log(item.types);
    for (const type of item.types) {
      if (!/(:?web )?image\//.test(type)) {
        continue;
      }
      const blob = await item.getType(type);
      const blobURL = URL.createObjectURL(blob);
      const img = document.createElement("img");
      img.addEventListener("load", () => {
        URL.revokeObjectURL(blobURL);
      });
      img.src = blobURL;
      document.body.append(img);
      document.body.append(
        document.createTextNode(`Pasted image as ${blob.type}`)
      );
    }
  }
});
