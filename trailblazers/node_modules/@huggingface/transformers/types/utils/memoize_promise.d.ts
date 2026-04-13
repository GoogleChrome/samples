/**
 * Returns the cached promise for `key`, or calls `factory` to create one and caches it.
 * Subsequent calls with the same key return the same promise whether it is still
 * pending or already resolved, so the factory is never invoked more than once per key.
 * If the promise rejects, the entry is removed from the cache so the operation can be retried.
 *
 * @template T
 * @param {string} key A unique identifier for this async operation.
 * @param {() => Promise<T>} factory A function that returns the promise to memoize.
 *   Only called when no entry exists for `key`.
 * @returns {Promise<T>}
 */
export function memoizePromise<T>(key: string, factory: () => Promise<T>): Promise<T>;
//# sourceMappingURL=memoize_promise.d.ts.map