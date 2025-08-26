const log = document.getElementById('log');

export const logMessage = (message) => {
  const row = document.createElement('div');
  row.innerHTML = `[${new Date().toISOString()}]: ${message}`;
  
  // Insert after header.
  log.firstElementChild.after(row);
}