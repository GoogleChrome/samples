/**
 * A simple Least Recently Used (LRU) cache implementation in JavaScript.
 * This cache stores key-value pairs and evicts the least recently used item
 * when the capacity is exceeded.
 */
export class LRUCache {
    /**
     * Creates an LRUCache instance.
     * @param {number} capacity The maximum number of items the cache can hold.
     */
    constructor(capacity: number);
    /**
     * Retrieves the value associated with the given key and marks the key as recently used.
     * @param {any} key The key to retrieve.
     * @returns {any} The value associated with the key, or undefined if the key does not exist.
     */
    get(key: any): any;
    /**
     * Inserts or updates the key-value pair in the cache.
     * If the key already exists, it is updated and marked as recently used.
     * If the cache exceeds its capacity, the least recently used item is evicted.
     * @param {any} key The key to add or update.
     * @param {any} value The value to associate with the key.
     */
    put(key: any, value: any): void;
    /**
     * Removes the entry for the given key from the cache.
     * @param {any} key The key to delete.
     * @returns {boolean} `true` if the entry existed and was removed, `false` otherwise.
     */
    delete(key: any): boolean;
    /**
     * Clears the cache.
     */
    clear(): void;
    #private;
}
//# sourceMappingURL=lru_cache.d.ts.map