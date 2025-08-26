const DB_NAME = 'fake-chat-db2';
const DB_VERSION = 2;
const LOG_STORE_NAME = 'logs';
const CHAT_STORE_NAME = 'chats';
const CHAT_INDEX_NAME = 'chatsByChatId';
let db = null;
const channel = new BroadcastChannel('chat-channel');

async function openDB() {
  if (!db) {
    db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = event => {
        // delete the old database, if there
        const db = event.target.result;
        if (event.oldVersion) {
          try {
            db.deleteObjectStore(LOG_STORE_NAME);
          } catch {
            // ignore
          }
          try {
            db.deleteObjectStore(CHAT_STORE_NAME);
          } catch {
            // ignore
          }
        }
        db.createObjectStore(LOG_STORE_NAME, {autoIncrement: true});
        const chatStore =
            db.createObjectStore(CHAT_STORE_NAME, {autoIncrement: true});
        chatStore.createIndex('chatsByChatId', 'chatId', {unique: false});
      };

      request.onsuccess = event => {
        resolve(event.target.result);
      };

      request.onerror = event => {
        reject(event.target.error);
      };
    });
  }
  return db;
}

export async function addLog(message, source) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LOG_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(LOG_STORE_NAME);
    let date = Date.now();
    const request = store.add({message, timestamp: date, source});

    request.onsuccess = event => {
      channel.postMessage({type: 'onLogsChanged'});
      resolve();
    };

    request.onerror = event => {
      reject(event.target.error);
    };
  });
}

export function getLogs() {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(LOG_STORE_NAME, 'readonly');
      const store = transaction.objectStore(LOG_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = event => {
        resolve(event.target.result);
      };

      request.onerror = event => {
        reject(event.target.error);
      };
    });
  });
}

export function clearLogs() {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(LOG_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(LOG_STORE_NAME);
      const request = store.clear();
      request.onsuccess = event => {
        channel.postMessage({type: 'onLogsChanged'});
        resolve();
      };
      request.onerror = event => {
        reject(event.target.error);
      };
    });
  });
}

export function addChat(chatId, message, author) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CHAT_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(CHAT_STORE_NAME);
      let date = Date.now();
      const request =
          store.put({chatId, message, timestamp: date, author});

      request.onsuccess = event => {
        channel.postMessage({type: 'onChatAdded', chatId});
        resolve();
      };

      request.onerror = event => {
        reject(event.target.error);
      };
    });
  });
}

export function getChats(chatId) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CHAT_STORE_NAME, 'readonly');
      const store = transaction.objectStore(CHAT_STORE_NAME);
      const index = store.index(CHAT_INDEX_NAME);
      const request = index.getAll(chatId);

      request.onsuccess = event => {
        const chats = event.target.result;
        chats.sort((a, b) => b.timestamp - a.timestamp);
        resolve(chats);
      };

      request.onerror = event => {
        reject(event.target.error);
      };
    });
  });
}

export function clearChats() {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CHAT_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(CHAT_STORE_NAME);
      const request = store.clear();
      request.onsuccess = event => {
        channel.postMessage({type: 'onAllChatsCleared'});
        resolve();
      };
      request.onerror = event => {
        reject(event.target.error);
      };
    });
  });
};