function logMessage(message) {
  const logContainer = document.getElementById('observer');
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

const callback = async (records, observer) => {
  const icons = {
    created: '✅',
    appeared: '✅',
    modified: '📝',
    deleted: '🗑️',
    disappeared: '🗑️',
  };
  for (const record of records) {
    console.log(record);
    if (record.changedHandle && record.changedHandle.name.endsWith('.crswap')) {
      continue;
    }
    if (!record.changedHandle) {
      continue;
    }
    logMessage(
      `The ${record.changedHandle.kind} "${record.changedHandle.name}" ${['modified', 'deleted', 'created'].includes(record.type) ? 'was ' : ''}${
        icons[record.type]
      } ${record.type}`
    );
  }
};

(async () => {
  const observer = new self.FileSystemObserver(callback);
  await observer.observe(await navigator.storage.getDirectory());
})();
