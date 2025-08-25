(async () => {
  const rootHandle = await navigator.storage.getDirectory();
  await rootHandle.remove({ recursive: true });
  await startObserver();

  async function startObserver() {
    if ('FileSystemObserver' in self) {
      await import('./observer.js');
      demoOPFS();
    } else {
      document.querySelector('pre').textContent =
        '😕 Your browser does not support the File System Observer API';
    }
  }

  async function demoOPFS() {
    const loremIpsum =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

    function logMessage(message) {
      const logContainer = document.getElementById('log');
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.textContent = message;

      logContainer.appendChild(logEntry);

      // Ensure we only keep the last 10 log entries
      while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.firstChild);
      }

      // Scroll to the bottom of the log
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    async function getRandomFileHandle() {
      const files = [];
      for await (const entry of rootHandle.values()) {
        if (entry.kind === 'file') {
          files.push(entry);
        }
      }
      if (files.length === 0) {
        return null;
      }
      const randomIndex = Math.floor(Math.random() * files.length);
      return files[randomIndex];
    }

    async function createFile() {
      const fileName = `file_${Date.now()}.txt`;
      const fileHandle = await rootHandle.getFileHandle(fileName, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      const text = loremIpsum.repeat(Math.floor(Math.random() * 20) + 1);
      await writable.write(text);
      await writable.close();
      logMessage(`✅ Created file "${fileName}"`);
    }

    async function deleteFile() {
      const fileHandle = await getRandomFileHandle();
      if (!fileHandle) {
        return;
      }
      await rootHandle.removeEntry(fileHandle.name);
      logMessage(`🗑️ Deleted file "${fileHandle.name}"`);
    }

    async function modifyFile() {
      const fileHandle = await getRandomFileHandle();
      if (!fileHandle) {
        return;
      }
      const writable = await fileHandle.createWritable();
      const text = loremIpsum.repeat(Math.floor(Math.random() * 20) + 1);
      await writable.write(text);
      await writable.close();
      logMessage(`📝 Modified file "${fileHandle.name}"`);
    }

    async function performRandomOperation() {
      const operations = [createFile, deleteFile, modifyFile];
      const randomOperation =
        operations[Math.floor(Math.random() * operations.length)];
      try {
        await randomOperation();
      } catch {
        // No op
      }
    }

    // Perform random operations in an interval
    setInterval(performRandomOperation, 2000); // every 2 seconds
  }
})();
