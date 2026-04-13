/**
 * Joins multiple parts of a path into a single path, while handling leading and trailing slashes.
 *
 * @param {...string} parts Multiple parts of a path.
 * @returns {string} A string representing the joined path.
 */
export function pathJoin(...parts: string[]): string;
/**
 * Determines whether the given string is a valid URL.
 * @param {string|URL} string The string to test for validity as an URL.
 * @param {string[]} [protocols=null] A list of valid protocols. If specified, the protocol must be in this list.
 * @param {string[]} [validHosts=null] A list of valid hostnames. If specified, the URL's hostname must be in this list.
 * @returns {boolean} True if the string is a valid URL, false otherwise.
 */
export function isValidUrl(string: string | URL, protocols?: string[], validHosts?: string[]): boolean;
/**
 * Tests whether a string is a valid Hugging Face model ID or not.
 * Adapted from https://github.com/huggingface/huggingface_hub/blob/6378820ebb03f071988a96c7f3268f5bdf8f9449/src/huggingface_hub/utils/_validators.py#L119-L170
 *
 * @param {string} string The string to test
 * @returns {boolean} True if the string is a valid model ID, false otherwise.
 */
export function isValidHfModelId(string: string): boolean;
/**
 * Helper method to handle fatal errors that occur while trying to load a file from the Hugging Face Hub.
 * @param {number} status The HTTP status code of the error.
 * @param {string} remoteURL The URL of the file that could not be loaded.
 * @param {boolean} fatal Whether to raise an error if the file could not be loaded.
 * @returns {null} Returns `null` if `fatal = true`.
 * @throws {Error} If `fatal = false`.
 */
export function handleError(status: number, remoteURL: string, fatal: boolean): null;
/**
 * Read and track progress when reading a Response object
 *
 * @param {Response|import('./FileResponse.js').FileResponse} response The Response object to read
 * @param {(data: {progress: number, loaded: number, total: number}) => void} progress_callback The function to call with progress updates
 * @param {number} [expectedSize] The expected size of the file (used when content-length header is missing)
 * @returns {Promise<Uint8Array>} A Promise that resolves with the Uint8Array buffer
 */
export function readResponse(response: Response | import("./FileResponse.js").FileResponse, progress_callback: (data: {
    progress: number;
    loaded: number;
    total: number;
}) => void, expectedSize?: number): Promise<Uint8Array>;
/**
 * Checks if the given URL is a blob URL (created via URL.createObjectURL).
 * Blob URLs should not be cached as they are temporary in-memory references.
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is a blob URL, false otherwise.
 */
export function isBlobURL(url: string): boolean;
/**
 * Converts any URL to an absolute URL if needed.
 * If the URL is already absolute (http://, https://, or blob:), returns it unchanged (handled by new URL(...)).
 * Otherwise, resolves it relative to the current page location (browser) or module location (Node/Bun/Deno).
 * @param {string} url - The URL to convert (can be relative or absolute).
 * @returns {string} The absolute URL.
 */
export function toAbsoluteURL(url: string): string;
//# sourceMappingURL=utils.d.ts.map