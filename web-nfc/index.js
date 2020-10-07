scanButton.addEventListener("click", async () => {
  log("User clicked scan button");

  try {
    const reader = new NDEFReader();
    await reader.scan();
    log("> Scan started");

    reader.addEventListener("error", (event) => {
      log(`Argh! ${event.message}`);
    });

    reader.addEventListener("reading", ({ message, serialNumber }) => {
      log(`> Serial Number: ${serialNumber}`);
      log(`> Records: (${message.records.length})`);
    });
  } catch (error) {
    log("Argh! " + error);
  }
});

writeButton.addEventListener("click", async () => {
  log("User clicked write button");

  try {
    const writer = new NDEFWriter();
    await writer.write("Hello world!");
    log("> Message written");
  } catch (error) {
    log("Argh! " + error);
  }
});
