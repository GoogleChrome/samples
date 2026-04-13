/**
 * @typedef {boolean|number} ExternalData
 * Specifies whether to load the model using the external data format.
 * - `false`: Do not use external data format
 * - `true`: Use external data format with 1 chunk
 * - `number`: Use external data format with the specified number of chunks
 */
/**
 * @typedef {Object} PretrainedOptions Options for loading a pretrained model.
 * @property {import('./core.js').ProgressCallback} [progress_callback=null] If specified, this function will be called during model construction, to provide the user with progress updates.
 * @property {import('../configs.js').PretrainedConfig} [config=null] Configuration for the model to use instead of an automatically loaded configuration. Configuration can be automatically loaded when:
 * - The model is a model provided by the library (loaded with the *model id* string of a pretrained model).
 * - The model is loaded by supplying a local directory as `pretrained_model_name_or_path` and a configuration JSON file named *config.json* is found in the directory.
 * @property {string} [cache_dir=null] Path to a directory in which a downloaded pretrained model configuration should be cached if the standard cache should not be used.
 * @property {boolean} [local_files_only=false] Whether or not to only look at local files (e.g., not try downloading the model).
 * @property {string} [revision='main'] The specific model version to use. It can be a branch name, a tag name, or a commit id,
 * since we use a git-based system for storing models and other artifacts on huggingface.co, so `revision` can be any identifier allowed by git.
 * NOTE: This setting is ignored for local requests.
 */
/**
 * @typedef {Object} ModelSpecificPretrainedOptions Options for loading a pretrained model.
 * @property {string} [subfolder='onnx'] In case the relevant files are located inside a subfolder of the model repo on huggingface.co,
 * you can specify the folder name here.
 * @property {string} [model_file_name=null] If specified, load the model with this name (excluding the dtype and .onnx suffixes). Currently only valid for encoder- or decoder-only models.
 * @property {import("./devices.js").DeviceType|Record<string, import("./devices.js").DeviceType>} [device=null] The device to run the model on. If not specified, the device will be chosen from the environment settings.
 * @property {import("./dtypes.js").DataType|Record<string, import("./dtypes.js").DataType>} [dtype=null] The data type to use for the model. If not specified, the data type will be chosen from the environment settings.
 * @property {ExternalData|Record<string, ExternalData>} [use_external_data_format=false] Whether to load the model using the external data format (used for models >= 2GB in size).
 * @property {import('onnxruntime-common').InferenceSession.SessionOptions} [session_options] (Optional) User-specified session options passed to the runtime. If not provided, suitable defaults will be chosen.
 */
/**
 * @typedef {PretrainedOptions & ModelSpecificPretrainedOptions} PretrainedModelOptions Options for loading a pretrained model.
 */
/**
 * Helper function to get a file, using either the Fetch API or FileSystem API.
 *
 * @param {URL|string} urlOrPath The URL/path of the file to get.
 * @returns {Promise<FileResponse|Response>} A promise that resolves to a FileResponse object (if the file is retrieved using the FileSystem API), or a Response object (if the file is retrieved using the Fetch API).
 */
export function getFile(urlOrPath: URL | string): Promise<FileResponse | Response>;
/**
 * Generates appropriate HTTP headers for fetching resources.
 * In Node.js environments, adds User-Agent and Authorization headers when applicable.
 * In browser environments, returns minimal headers for security.
 *
 * @param {URL|string} urlOrPath The URL or path being fetched.
 * @returns {Headers} A Headers object with appropriate headers for the request.
 */
export function getFetchHeaders(urlOrPath: URL | string): Headers;
/**
 * Builds the resource paths and URLs for a model file.
 * Can be used to get the resource URL or path without loading the file.
 *
 * @param {string} path_or_repo_id This can be either:
 * - a string, the *model id* of a model repo on huggingface.co.
 * - a path to a *directory* potentially containing the file.
 * @param {string} filename The name of the file to locate.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * @param {import('./cache.js').CacheInterface | null} [cache] The cache instance to use for determining cache keys.
 * @returns {{ requestURL: string, localPath: string, remoteURL: string, proposedCacheKey: string, validModelId: boolean }}
 * An object containing all the paths and URLs for the resource.
 */
export function buildResourcePaths(path_or_repo_id: string, filename: string, options?: PretrainedOptions, cache?: import("./cache.js").CacheInterface | null): {
    requestURL: string;
    localPath: string;
    remoteURL: string;
    proposedCacheKey: string;
    validModelId: boolean;
};
/**
 * Checks if a resource exists in cache.
 *
 * @param {import('./cache.js').CacheInterface | null} cache The cache instance to check.
 * @param {string} localPath The local path to try first.
 * @param {string} proposedCacheKey The proposed cache key to try second.
 * @returns {Promise<Response|import('./hub/FileResponse.js').FileResponse|undefined|string>}
 * The cached response if found, undefined otherwise.
 */
export function checkCachedResource(cache: import("./cache.js").CacheInterface | null, localPath: string, proposedCacheKey: string): Promise<Response | import("./hub/FileResponse.js").FileResponse | undefined | string>;
/**
 * Stores a resource in the cache.
 *
 * @param {string} path_or_repo_id The path or repo ID of the model.
 * @param {string} filename The name of the file to cache.
 * @param {import('./cache.js').CacheInterface} cache The cache instance to store in.
 * @param {string} cacheKey The cache key to use.
 * @param {Response|import('./hub/FileResponse.js').FileResponse} response The response to cache.
 * @param {Uint8Array} [result] The result buffer if already read.
 * @param {PretrainedOptions} [options] Options containing progress callback and context for progress updates.
 * @returns {Promise<void>}
 */
export function storeCachedResource(path_or_repo_id: string, filename: string, cache: import("./cache.js").CacheInterface, cacheKey: string, response: Response | import("./hub/FileResponse.js").FileResponse, result?: Uint8Array, options?: PretrainedOptions): Promise<void>;
/**
 * Loads a resource file from local or remote sources.
 *
 * @param {string} path_or_repo_id This can be either:
 * - a string, the *model id* of a model repo on huggingface.co.
 * - a path to a *directory* potentially containing the file.
 * @param {string} filename The name of the file to locate.
 * @param {boolean} [fatal=true] Whether to throw an error if the file is not found.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * @param {boolean} [return_path=false] Whether to return the path of the file instead of the file content.
 * @param {import('./cache.js').CacheInterface | null} [cache] The cache instance to use.
 *
 * @throws Will throw an error if the file is not found and `fatal` is true.
 * @returns {Promise<string|Uint8Array|null>} A Promise that resolves with the file content as a Uint8Array if `return_path` is false, or the file path as a string if `return_path` is true.
 */
export function loadResourceFile(path_or_repo_id: string, filename: string, fatal?: boolean, options?: PretrainedOptions, return_path?: boolean, cache?: import("./cache.js").CacheInterface | null): Promise<string | Uint8Array | null>;
/**
 * Retrieves a file from either a remote URL using the Fetch API or from the local file system using the FileSystem API.
 * If the filesystem is available and `env.useCache = true`, the file will be downloaded and cached.
 *
 * @param {string} path_or_repo_id This can be either:
 * - a string, the *model id* of a model repo on huggingface.co.
 * - a path to a *directory* potentially containing the file.
 * @param {string} filename The name of the file to locate in `path_or_repo`.
 * @param {boolean} [fatal=true] Whether to throw an error if the file is not found.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * @param {boolean} [return_path=false] Whether to return the path of the file instead of the file content.
 *
 * @throws Will throw an error if the file is not found and `fatal` is true.
 * @returns {Promise<string|Uint8Array>} A Promise that resolves with the file content as a Uint8Array if `return_path` is false, or the file path as a string if `return_path` is true.
 */
export function getModelFile(path_or_repo_id: string, filename: string, fatal?: boolean, options?: PretrainedOptions, return_path?: boolean): Promise<string | Uint8Array>;
/**
 * Fetches a text file from a given path and file name.
 *
 * @param {string} modelPath The path to the directory containing the file.
 * @param {string} fileName The name of the file to fetch.
 * @param {boolean} [fatal=true] Whether to throw an error if the file is not found.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * @returns {Promise<string|null>} The text content of the file.
 * @throws Will throw an error if the file is not found and `fatal` is true.
 */
export function getModelText(modelPath: string, fileName: string, fatal?: boolean, options?: PretrainedOptions): Promise<string | null>;
/**
 * Fetches a JSON file from a given path and file name.
 *
 * @param {string} modelPath The path to the directory containing the file.
 * @param {string} fileName The name of the file to fetch.
 * @param {boolean} [fatal=true] Whether to throw an error if the file is not found.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * @returns {Promise<Object>} The JSON data parsed into a JavaScript object.
 * @throws Will throw an error if the file is not found and `fatal` is true.
 */
export function getModelJSON(modelPath: string, fileName: string, fatal?: boolean, options?: PretrainedOptions): Promise<any>;
export { MAX_EXTERNAL_DATA_CHUNKS } from "./hub/constants.js";
/**
 * Specifies whether to load the model using the external data format.
 * - `false`: Do not use external data format
 * - `true`: Use external data format with 1 chunk
 * - `number`: Use external data format with the specified number of chunks
 */
export type ExternalData = boolean | number;
/**
 * Options for loading a pretrained model.
 */
export type PretrainedOptions = {
    /**
     * If specified, this function will be called during model construction, to provide the user with progress updates.
     */
    progress_callback?: import("./core.js").ProgressCallback;
    /**
     * Configuration for the model to use instead of an automatically loaded configuration. Configuration can be automatically loaded when:
     * - The model is a model provided by the library (loaded with the *model id* string of a pretrained model).
     * - The model is loaded by supplying a local directory as `pretrained_model_name_or_path` and a configuration JSON file named *config.json* is found in the directory.
     */
    config?: import("../configs.js").PretrainedConfig;
    /**
     * Path to a directory in which a downloaded pretrained model configuration should be cached if the standard cache should not be used.
     */
    cache_dir?: string;
    /**
     * Whether or not to only look at local files (e.g., not try downloading the model).
     */
    local_files_only?: boolean;
    /**
     * The specific model version to use. It can be a branch name, a tag name, or a commit id,
     * since we use a git-based system for storing models and other artifacts on huggingface.co, so `revision` can be any identifier allowed by git.
     * NOTE: This setting is ignored for local requests.
     */
    revision?: string;
};
/**
 * Options for loading a pretrained model.
 */
export type ModelSpecificPretrainedOptions = {
    /**
     * In case the relevant files are located inside a subfolder of the model repo on huggingface.co,
     * you can specify the folder name here.
     */
    subfolder?: string;
    /**
     * If specified, load the model with this name (excluding the dtype and .onnx suffixes). Currently only valid for encoder- or decoder-only models.
     */
    model_file_name?: string;
    /**
     * The device to run the model on. If not specified, the device will be chosen from the environment settings.
     */
    device?: import("./devices.js").DeviceType | Record<string, import("./devices.js").DeviceType>;
    /**
     * The data type to use for the model. If not specified, the data type will be chosen from the environment settings.
     */
    dtype?: import("./dtypes.js").DataType | Record<string, import("./dtypes.js").DataType>;
    /**
     * Whether to load the model using the external data format (used for models >= 2GB in size).
     */
    use_external_data_format?: ExternalData | Record<string, ExternalData>;
    /**
     * (Optional) User-specified session options passed to the runtime. If not provided, suitable defaults will be chosen.
     */
    session_options?: import("onnxruntime-common").InferenceSession.SessionOptions;
};
/**
 * Options for loading a pretrained model.
 */
export type PretrainedModelOptions = PretrainedOptions & ModelSpecificPretrainedOptions;
import { FileResponse } from './hub/FileResponse.js';
//# sourceMappingURL=hub.d.ts.map