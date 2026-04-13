/**
 * A simple Least Recently Used (LRU) cache implementation in JavaScript.
 * This cache stores key-value pairs and evicts the least recently used item
 * when the capacity is exceeded.
 */
declare class LRUCache<K, V> {
    private capacity;
    private cache;
    /**
     * Creates an LRUCache instance.
     * @param capacity The maximum number of items the cache can hold.
     */
    constructor(capacity: number);
    /**
     * Retrieves the value associated with the given key and marks the key as recently used.
     * @param key The key to retrieve.
     * @returns The value associated with the key, or undefined if the key does not exist.
     */
    get(key: K): V | undefined;
    /**
     * Inserts or updates the key-value pair in the cache.
     * If the key already exists, it is updated and marked as recently used.
     * If the cache exceeds its capacity, the least recently used item is evicted.
     * @param key The key to add or update.
     * @param value The value to associate with the key.
     */
    put(key: K, value: V): void;
    /**
     * Clears the cache.
     */
    clear(): void;
}
export default LRUCache;
