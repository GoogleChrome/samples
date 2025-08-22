// server.mjs

// 1. Modern ES Module imports
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import EventSource from 'eventsource';

// --- Initialization ---
const app = express();
const server = createServer(app);
// 2. Updated Socket.IO v4+ initialization
const io = new Server(server);
const port = process.env.PORT || 4000;

// --- Middleware ---
app.use(express.static('public'));

// --- Socket.IO Connection Handling ---
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
});

// --- Wikimedia Event Stream ---
const eventSourceInitDict = {
  headers: {
    'User-Agent': 'Modern-Node-Example/1.0 (https://your-website.com)',
  },
};

const url = "https://stream.wikimedia.org/v2/stream/recentchange";
const eventsource = new EventSource(url, eventSourceInitDict);

eventsource.onerror = (err) => {
  console.error("EventSource failed:", err);
};

eventsource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    // 3. Correctly emit with an event name and a payload
    // This allows the client to listen specifically for 'recentchange'
    io.emit('recentchange', data);
  } catch (err) {
    console.error("Failed to parse or emit message data:", err);
  }
};

// --- Start Server ---
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});