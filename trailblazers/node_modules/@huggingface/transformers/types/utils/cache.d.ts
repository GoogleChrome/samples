/**
 * @typedef {Object} CacheInterface
 * @property {(request: string) => Promise<Response|import('./hub/FileResponse.js').FileResponse|undefined|string>} match
 * Checks if a request is in the cache and returns the cached response if found.
 * @property {(request: string, response: Response, progress_callback?: (data: {progress: number, loaded: number, total: number}) => void) => Promise<void>} put
 * Adds a response to the cache.
 * @property {(request: string) => Promise<boolean>} [delete]
 * Deletes a request from the cache. Returns true if deleted, false otherwise.
 */
/**
 * Retrieves an appropriate caching backend based on the environment configuration.
 * Attempts to use custom cache, browser cache, or file system cache in that order of priority.
 * @returns {Promise<CacheInterface | null>}
 * @param file_cache_dir {string|null} Path to a directory in which a downloaded pretrained model configuration should be cached if using the file system cache.
 */
export function getCache(file_cache_dir?: string | null): Promise<CacheInterface | null>;
/**
 * Searches the cache for any of the provided names and returns the first match found.
 * @param {CacheInterface} cache The cache to search
 * @param {...string} names The names of the items to search for
 * @returns {Promise<import('./hub/FileResponse.js').FileResponse|Response|undefined|string>} The item from the cache, or undefined if not found.
 */
export function tryCache(cache: CacheInterface, ...names: string[]): Promise<import("./hub/FileResponse.js").FileResponse | Response | undefined | string>;
export type CacheInterface = {
    /**
     * Checks if a request is in the cache and returns the cached response if found.
     */
    match: (request: string) => Promise<Response | import("./hub/FileResponse.js").FileResponse | undefined | string>;
    /**
     * Adds a response to the cache.
     */
    put: (request: string, response: Response, progress_callback?: (data: {
        progress: number;
        loaded: number;
        total: number;
    }) => void) => Promise<void>;
    /**
     * Deletes a request from the cache. Returns true if deleted, false otherwise.
     */
    delete?: (request: string) => Promise<boolean>;
};
//# sourceMappingURL=cache.d.ts.map