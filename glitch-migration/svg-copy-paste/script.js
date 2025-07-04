const [copyButton, pasteButton] = Array.from(
  document.querySelectorAll("button")
);
const div = document.querySelector("div");
const output = document.querySelector("output");

fetch("./circles.svg")
  .then((response) => response.text())
  .then((text) => (div.innerHTML = text));

const supportsSVG = () => {
  if (
    !("supports" in window.ClipboardItem) ||
    !window.ClipboardItem.supports("image/svg+xml")
  ) {
    alert("Your browser doesn't support copying SVGs.");
    return false;
  }
  return true;
};

copyButton.addEventListener("click", async () => {
  if (!supportsSVG()) {
    return;
  }
  try {
    const blob = await fetch("./circles.svg").then((response) =>
      response.blob()
    );
    await navigator.clipboard.write([
      new window.ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  } catch (err) {
    console.error(err.name, err.message);
    alert(err.message);
  }
});

pasteButton.addEventListener("click", async () => {
  if (!supportsSVG()) {
    return;
  }
  const [clipboardItem] = await navigator.clipboard.read();
  const svgBlob = await clipboardItem.getType("image/svg+xml");
  if (!svgBlob) {
    alert("No SVG in the clipboard.");
    return;
  }
  // Getting the source code here, since :hover effects don't
  // work when the SVG is referenced as `<img src>`.
  const svgCode = await svgBlob.text();
  const p = document.createElement("p");
  p.innerHTML = svgCode;
  output.append(p);
});
