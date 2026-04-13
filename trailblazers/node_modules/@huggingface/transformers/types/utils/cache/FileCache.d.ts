/**
 * File system cache implementation that implements the CacheInterface.
 * Provides `match` and `put` methods compatible with the Web Cache API.
 */
export class FileCache {
    /**
     * Instantiate a `FileCache` object.
     * @param {string} path
     */
    constructor(path: string);
    path: string;
    /**
     * Checks whether the given request is in the cache.
     * @param {string} request
     * @returns {Promise<FileResponse | undefined>}
     */
    match(request: string): Promise<FileResponse | undefined>;
    /**
     * Adds the given response to the cache.
     * @param {string} request
     * @param {Response} response
     * @param {(data: {progress: number, loaded: number, total: number}) => void} [progress_callback] Optional.
     * The function to call with progress updates
     * @returns {Promise<void>}
     */
    put(request: string, response: Response, progress_callback?: (data: {
        progress: number;
        loaded: number;
        total: number;
    }) => void): Promise<void>;
    /**
     * Deletes the cache entry for the given request.
     * @param {string} request
     * @returns {Promise<boolean>} A Promise that resolves to `true` if the cache entry was deleted, `false` otherwise.
     */
    delete(request: string): Promise<boolean>;
}
import { FileResponse } from '../hub/FileResponse.js';
//# sourceMappingURL=FileCache.d.ts.map