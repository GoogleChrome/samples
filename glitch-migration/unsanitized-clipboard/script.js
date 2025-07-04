const button = document.querySelector("button");
const textareas = Array.from(document.querySelectorAll("textarea"));

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="ProgId" content="Excel.Sheet" />
    <meta name="Generator" content="Microsoft Excel 15" />
    <title>Excel</title>
    <script>
      alert(1);
    </script>
    <style>
      body {
        font-family: HK Grotesk;
        background-color: var(--color-bg);
      }
    </style>
  </head>
  <body>
    <div>hello</div>
  </body>
</html>`;

textareas[0].textContent = html;
textareas[0].disabled = true;

button.addEventListener("click", async () => {
  const htmlBlob = new Blob([html], { type: "text/html" });

  const clipboardItem = new window.ClipboardItem({
    "text/html": htmlBlob,
  });

  await navigator.clipboard.write([clipboardItem]);

  let clipboardItems = await navigator.clipboard.read({
    unsanitized: ["text/html"],
  });
  let blobOutput = await clipboardItems[0].getType("text/html");
  textareas[1].value = await blobOutput.text();
  clipboardItems = await navigator.clipboard.read();
  blobOutput = await clipboardItems[0].getType("text/html");
  textareas[2].value = await blobOutput.text();
});
