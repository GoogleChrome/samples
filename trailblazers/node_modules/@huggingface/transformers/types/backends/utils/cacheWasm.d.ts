/**
 * Loads and caches the WASM binary for ONNX Runtime.
 * @param {string} wasmURL The URL of the WASM file to load.
 * @returns {Promise<ArrayBuffer|null>} The WASM binary as an ArrayBuffer, or null if loading failed.
 */
export function loadWasmBinary(wasmURL: string): Promise<ArrayBuffer | null>;
/**
 * Loads and caches the WASM Factory (.mjs file) for ONNX Runtime.
 * Creates a blob URL from cached content (when safe) to bridge Cache API with dynamic imports used in ORT.
 * @param {string} libURL The URL of the WASM Factory to load.
 * @returns {Promise<string|null>} The blob URL (if enabled), original URL (if disabled), or null if loading failed.
 */
export function loadWasmFactory(libURL: string): Promise<string | null>;
//# sourceMappingURL=cacheWasm.d.ts.map