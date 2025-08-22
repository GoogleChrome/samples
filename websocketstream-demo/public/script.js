import { io } from "./socket.io.esm.min.js";

const LIST_SIZE = 25;
const ol = document.querySelector('ol.new');

const socket = io();

socket.on('connect', () => {
  console.log('Successfully connected to the server! Socket ID:', socket.id);
});

socket.on('recentchange', (data) => {
  display(data);
});

const display = (data) => {
  if (!data?.meta?.uri) {
    return;
  }
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = data.title;
      a.href = data.meta.uri;
      a.target = '_blank';
      li.append(a);

      if (ol.children.length === LIST_SIZE) {
        ol.firstChild.remove();
      }
      ol.append(li);
      resolve();
    }, 1000);
  });
};

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
