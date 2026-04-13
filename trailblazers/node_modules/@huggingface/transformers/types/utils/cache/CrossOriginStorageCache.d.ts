/**
 * A cache implementation backed by the experimental `navigator.crossOriginStorage` API,
 * which allows sharing cached files (identified by content hash) across origins.
 *
 * Implements {@link import('../cache.js').CacheInterface}.
 *
 * @see https://github.com/explainers-by-googlers/cross-origin-storage
 */
export class CrossOriginStorage {
    /**
     * Returns whether the `navigator.crossOriginStorage` API is available in the current environment.
     * @returns {boolean}
     */
    static isAvailable: () => boolean;
    /**
     * Returns (and lazily opens) the hash cache, reusing the same promise across concurrent callers.
     * @returns {Promise<Cache>}
     */
    _getHashCache: () => Promise<Cache>;
    /**
     * Looks up a cached response for the given URL by resolving its SHA-256 hash and requesting
     * the corresponding file handle from cross-origin storage.
     *
     * Implements `CacheInterface.match`.
     *
     * @param {string} request The URL of the resource to look up.
     * @returns {Promise<Response|undefined>} The cached `Response`, or `undefined` if not found.
     */
    match: (request: string) => Promise<Response | undefined>;
    /**
     * Stores a response in cross-origin storage, keyed by its SHA-256 hash.
     *
     * For LFS-backed URLs the hash is resolved cheaply via `_getFileHash` (which checks
     * `HASH_CACHE_NAME` first, then falls back to fetching the Git LFS pointer file)
     * without reading the response body a second time.
     *
     * For non-LFS resources the hash is unknown upfront.  In that case the body is consumed
     * in the background: the stream is read to compute the content hash, the file is written
     * into cross-origin storage, and the computed hash is persisted to `HASH_CACHE_NAME`
     * so that future `match` calls can resolve the file without a network round-trip.
     *
     * Implements `CacheInterface.put`.
     *
     * @param {string} request The URL of the resource (used as the hash-cache key).
     * @param {Response} response The response whose body will be written to the cache.
     * @returns {Promise<void>}
     */
    put: (request: string, response: Response) => Promise<void>;
    /**
     * Writes a blob into cross-origin storage using the given pre-computed hex hash string.
     *
     * @param {Blob} blob
     * @param {string} hashHex Hex-encoded SHA-256 hash of `blob`.
     * @returns {Promise<void>}
     */
    _storeBlobInCOS: (blob: Blob, hashHex: string) => Promise<void>;
    /**
     * Background task for non-LFS resources: consumes `stream`, computes the SHA-256 hash
     * of the resulting blob, stores it in cross-origin storage, and persists the computed
     * hash to `HASH_CACHE_NAME` keyed by `request` so future `match` calls can resolve the
     * file without a network round-trip.
     *
     * Called fire-and-forget from `put` — errors are swallowed so failures never surface to
     * the caller.
     *
     * @param {string} request The original resource URL.
     * @param {ReadableStream} stream The response body stream to consume.
     * @returns {Promise<void>}
     */
    _processAndStore: (request: string, stream: ReadableStream) => Promise<void>;
    /**
     * Deletes the cache entry for the given request.
     *
     * Removes the hash entry from `HASH_CACHE_NAME`. Note: cross-origin storage itself does not
     * expose a delete API, so only the local hash mapping is removed. For non-LFS URLs this
     * permanently prevents `match` from resolving the file. For LFS-backed URLs, `match` will
     * re-fetch the LFS pointer file on the next call and repopulate the hash cache automatically.
     *
     * Implements `CacheInterface.delete`.
     *
     * @param {string} request
     * @returns {Promise<boolean>} Resolves to `true` if the hash entry was deleted, `false` otherwise.
     */
    delete: (request: string) => Promise<boolean>;
    /**
     * Resolves the SHA-256 hash for a given URL.
     *
     * Returns the cached hash immediately if one has been persisted to `HASH_CACHE_NAME`.
     * Otherwise falls back to `_getLfsFileHash` to retrieve the hash from the Hugging Face
     * LFS pointer file, persisting the result to `HASH_CACHE_NAME` for future lookups.
     *
     * Returns `null` if the hash cannot be determined (e.g. non-LFS URL with no cached entry).
     *
     * @param {string} url The resource URL to resolve a hash for.
     * @returns {Promise<string|null>} The hex-encoded SHA-256 hash, or `null` if unavailable.
     */
    _getFileHash: (url: string) => Promise<string | null>;
    /**
     * Attempts to retrieve the SHA-256 hash for a Hugging Face resource URL from its raw
     * Git LFS pointer file.
     *
     * Only applicable to URLs containing `/resolve/` (i.e. Hugging Face resolved file URLs).
     * The `/resolve/` segment is rewritten to `/raw/` to fetch the LFS pointer directly.
     * Returns `null` for non-LFS URLs or when the network request fails.
     *
     * @see https://huggingface.co/docs/hub/en/storage-backends#xet
     * @param {string} url The resolved Hugging Face URL of the resource.
     * @returns {Promise<string|null>} The hex-encoded SHA-256 hash, or `null` if unavailable.
     */
    _getLfsFileHash: (url: string) => Promise<string | null>;
    /**
     * Computes the SHA-256 hash of a `Blob`'s contents.
     *
     * @param {Blob} blob The blob to hash.
     * @returns {Promise<string>} The lowercase hex-encoded SHA-256 hash.
     */
    _getBlobHash: (blob: Blob) => Promise<string>;
    #private;
}
//# sourceMappingURL=CrossOriginStorageCache.d.ts.map