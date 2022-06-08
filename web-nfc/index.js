  scanButton.addEventListener("click", async () => {
  log("User clicked scan button");

  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    log("> Scan started");

    ndef.addEventListener("readingerror", () => {
      log("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", ({ message, serialNumber }) => {
      log(`> Serial Number: ${serialNumber}`);
      log(`> Records: (${message.records.length})`);
      
      for (const record of message.records) {
          log(`\nRecord id: ${record.id}`);
          log(`Record type: ${record.recordType}`);
          log(`MIME type: ${record.mediaType}`);          
          switch (record.recordType) {
            case "text":
              {
                const textDecoder = new TextDecoder(record.encoding);
                log(`Text: ${textDecoder.decode(record.data)} (${record.lang})`);
              }
              break;
            case "url":
              {
                const textDecoder = new TextDecoder();
                log(`URL: ${textDecoder.decode(record.data)}`);
              }
              break;
            default:
              // TODO: Handle other records with record data.
            }
          }
         }
       });
      } catch (error) {
    log("Argh! " + error);
  }
});

writeButton.addEventListener("click", async () => {
  log("User clicked write button");

  try {
    const ndef = new NDEFReader();
    await ndef.write("Hello world!");
    log("> Message written");
  } catch (error) {
    log("Argh! " + error);
  }
});

makeReadOnlyButton.addEventListener("click", async () => {
  log("User clicked make read-only button");

  try {
    const ndef = new NDEFReader();
    await ndef.makeReadOnly();
    log("> NFC tag has been made permanently read-only");
  } catch (error) {
    log("Argh! " + error);
  }
});
