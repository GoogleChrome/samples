/**
 * Simple Promise-based IndexedDB wrapper for large key-value storage.
 * Bypasses the 5MB limit of localStorage and supports native TypedArrays.
 */

const DB_NAME = 'GDriveEmbedsDB';
const STORE_NAME = 'AppStateCache';

/**
 * Open/Initialize the database store
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Retrieves a key value from the store
 */
export async function dbGet(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`IndexedDB get error for key "${key}":`, err);
    return null;
  }
}

/**
 * Stores a key-value pair in the database.
 * Supports structured objects, arrays, and typed arrays (Float32Array) directly.
 */
export async function dbSet(key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`IndexedDB put error for key "${key}":`, err);
    throw err;
  }
}

/**
 * Deletes a single key from the store
 */
export async function dbDelete(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error(`IndexedDB delete error for key "${key}":`, err);
  }
}

/**
 * Clears the entire database cache
 */
export async function dbClear() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('IndexedDB clear database error:', err);
  }
}
