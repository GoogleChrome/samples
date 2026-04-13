/**
 * A read-only object containing information about the APIs available in the current environment.
 */
export const apis: Readonly<{
    /** Whether we are running in a browser environment (and not a web worker) */
    IS_BROWSER_ENV: boolean;
    /** Whether we are running in a web worker environment */
    IS_WEBWORKER_ENV: boolean;
    /** Whether we are running in a web-like environment (browser, web worker, or Deno web runtime) */
    IS_WEB_ENV: boolean;
    /** Whether we are running in a service worker environment */
    IS_SERVICE_WORKER_ENV: boolean;
    /** Whether we are running in Deno's web runtime (CDN imports, Cache API available, no filesystem) */
    IS_DENO_WEB_RUNTIME: boolean;
    /** Whether the Cache API is available */
    IS_WEB_CACHE_AVAILABLE: boolean;
    /** Whether the WebGPU API is available */
    IS_WEBGPU_AVAILABLE: boolean;
    /** Whether the WebNN API is available */
    IS_WEBNN_AVAILABLE: boolean;
    /** Whether we are running in a Safari browser */
    IS_SAFARI: boolean;
    /** Whether the Node.js process API is available */
    IS_PROCESS_AVAILABLE: boolean;
    /** Whether we are running in a Node.js-like environment (node, deno, bun) */
    IS_NODE_ENV: boolean;
    /** Whether the filesystem API is available */
    IS_FS_AVAILABLE: boolean;
    /** Whether the path API is available */
    IS_PATH_AVAILABLE: boolean;
    /** Whether the crypto API is available */
    IS_CRYPTO_AVAILABLE: boolean;
    /** Whether the Chrome runtime API is available */
    IS_CHROME_AVAILABLE: boolean;
}>;
/**
 * Log levels for controlling output verbosity.
 *
 * Each level is represented by a number, where higher numbers include all lower level messages.
 * Use these values to set `env.logLevel`.
 *
 * @example
 * import { env, LogLevel } from '@huggingface/transformers';
 *
 * // Set log level to show only errors
 * env.logLevel = LogLevel.ERROR;
 *
 * // Set log level to show errors, warnings, and info
 * env.logLevel = LogLevel.INFO;
 *
 * // Disable all logging
 * env.logLevel = LogLevel.NONE;
 *
 */
export const LogLevel: Readonly<{
    /** All messages including debug output (value: 10) */
    DEBUG: 10;
    /** Errors, warnings, and info messages (value: 20) */
    INFO: 20;
    /** Errors and warnings (value: 30) */
    WARNING: 30;
    /** Only error messages (value: 40) */
    ERROR: 40;
    /** No logging output (value: 50) */
    NONE: 50;
}>;
/** @type {TransformersEnvironment} */
export const env: TransformersEnvironment;
/**
 * Global variable given visible to users to control execution. This provides users a simple way to configure Transformers.js.
 */
export type TransformersEnvironment = {
    /**
     * This version of Transformers.js.
     */
    version: string;
    /**
     * Expose environment variables of different backends,
     * allowing users to set these variables if they want to.
     */
    backends: {
        onnx: Partial<import("onnxruntime-common").Env> & {
            setLogLevel?: (logLevel: number) => void;
        };
    };
    /**
     * The logging level. Use LogLevel enum values. Defaults to LogLevel.ERROR.
     */
    logLevel: number;
    /**
     * Whether to allow loading of remote files, defaults to `true`.
     * If set to `false`, it will have the same effect as setting `local_files_only=true` when loading pipelines, models, tokenizers, processors, etc.
     */
    allowRemoteModels: boolean;
    /**
     * Host URL to load models from. Defaults to the Hugging Face Hub.
     */
    remoteHost: string;
    /**
     * Path template to fill in and append to `remoteHost` when loading models.
     */
    remotePathTemplate: string;
    /**
     * Whether to allow loading of local files, defaults to `false` if running in-browser, and `true` otherwise.
     * If set to `false`, it will skip the local file check and try to load the model from the remote host.
     */
    allowLocalModels: boolean;
    /**
     * Path to load local models from. Defaults to `/models/`.
     */
    localModelPath: string;
    /**
     * Whether to use the file system to load files. By default, it is `true` if available.
     */
    useFS: boolean;
    /**
     * Whether to use Cache API to cache models. By default, it is `true` if available.
     */
    useBrowserCache: boolean;
    /**
     * Whether to use the file system to cache files. By default, it is `true` if available.
     */
    useFSCache: boolean;
    /**
     * The directory to use for caching files with the file system. By default, it is `./.cache`.
     */
    cacheDir: string | null;
    /**
     * Whether to use a custom cache system (defined by `customCache`), defaults to `false`.
     */
    useCustomCache: boolean;
    /**
     * The custom cache to use. Defaults to `null`. Note: this must be an object which
     * implements the `match` and `put` functions of the Web Cache API. For more information, see https://developer.mozilla.org/en-US/docs/Web/API/Cache.
     */
    customCache: import("./utils/cache.js").CacheInterface | null;
    /**
     * Whether to pre-load and cache WASM binaries and the WASM factory (.mjs) for ONNX Runtime.
     * Defaults to `true` when cache is available. This can improve performance and enables offline usage by avoiding repeated downloads.
     */
    useWasmCache: boolean;
    /**
     * The cache key to use for storing models and WASM binaries. Defaults to 'transformers-cache'.
     */
    cacheKey: string;
    /**
     * Whether to use the Cross-Origin Storage API to cache model files
     * across origins, allowing different sites to share the same cached model weights. Defaults to `false`.
     * Requires the Cross-Origin Storage Chrome extension: {@link https://chromewebstore.google.com/detail/cross-origin-storage/denpnpcgjgikjpoglpjefakmdcbmlgih}.
     * The `experimental_` prefix indicates that the underlying browser API is not yet standardised and may change or be
     * removed without a major version bump. For more information, see {@link https://github.com/WICG/cross-origin-storage}.
     */
    experimental_useCrossOriginStorage: boolean;
    /**
     * The fetch function to use. Defaults to `fetch`.
     */
    fetch: (input: string | URL, init?: any) => Promise<any>;
};
//# sourceMappingURL=env.d.ts.map