window.onerror = function(msg, url, lineNo, columnNo, error) {
  document.body.innerHTML =
    "<pre>Message: " +
    msg +
    "\nURL: " +
    url +
    "\nLine: " +
    lineNo +
    "\nColumn: " +
    columnNo +
    "\nError: " +
    error +
    "\n\n</pre>";
};

const saveZippedButton = document.querySelector("button");
const pre = document.querySelector("pre");

class UpperCaseTransformStream {
  constructor() {
    return new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk.toUpperCase());
      }
    });
  }
}

saveZippedButton.addEventListener("click", async () => {
  try {
    const response = await fetch("./lorem-ipsum.txt");
    if (response.status !== 200 || !response.ok) {
      throw Error("Fetch error");
    }
    const readableStream = response.body.pipeThrough(new TextDecoderStream());
    const handle = await showSaveFilePicker({
      types: [
        {
          description: "GZIP File",
          accept: {
            "application/gzip": [".gz"]
          }
        }
      ]
    });
    const writableStream = await handle.createWritable();
    const [displayStream, zipStream] = readableStream.tee();

    const displayReader = displayStream.getReader();
    pre.textContent = "";
    while (true) {
      const { done, value } = await displayReader.read();
      if (done) {
        break;
      }
      pre.textContent += value;
    }

    zipStream
      .pipeThrough(new UpperCaseTransformStream())
      .pipeThrough(new TextEncoderStream())
      .pipeThrough(new CompressionStream("gzip"))
      .pipeTo(writableStream);
  } catch (err) {
    console.error(err.name, err.message);
    document.body.innerHTML = `<pre><strong>${err.name}:</strong> ${err.message}</pre>`;
  }
});
