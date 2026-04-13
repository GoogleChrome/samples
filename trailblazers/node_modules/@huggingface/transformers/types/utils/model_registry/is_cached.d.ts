/**
 * Quickly checks if a model is cached by verifying that `config.json` is present,
 * then confirming all required files are cached.
 * Returns a plain boolean — use `is_cached_files` if you need per-file detail.
 *
 * @param {string} modelId The model id (e.g., "Xenova/gpt2")
 * @param {Object} [options] Optional parameters
 * @param {string} [options.cache_dir] Custom cache directory
 * @param {string} [options.revision] Model revision (default: 'main')
 * @param {import('../../configs.js').PretrainedConfig} [options.config] Pre-loaded config
 * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype] Override dtype
 * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device] Override device
 * @returns {Promise<boolean>} Whether all required files are cached
 */
export function is_cached(modelId: string, options?: {
    cache_dir?: string;
    revision?: string;
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
}): Promise<boolean>;
/**
 * Checks if all files for a given model are already cached, with per-file detail.
 * Automatically determines which files are needed using get_files().
 *
 * @param {string} modelId The model id (e.g., "Xenova/gpt2")
 * @param {Object} [options] Optional parameters
 * @param {string} [options.cache_dir] Custom cache directory
 * @param {string} [options.revision] Model revision (default: 'main')
 * @param {import('../../configs.js').PretrainedConfig} [options.config] Pre-loaded config
 * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype] Override dtype
 * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device] Override device
 * @returns {Promise<CacheCheckResult>} Object with allCached boolean and files array with cache status
 */
export function is_cached_files(modelId: string, options?: {
    cache_dir?: string;
    revision?: string;
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
}): Promise<CacheCheckResult>;
/**
 * Quickly checks if all files for a specific pipeline task are cached by verifying
 * that `config.json` is present, then confirming all required files are cached.
 * Returns a plain boolean — use `is_pipeline_cached_files` if you need per-file detail.
 *
 * @param {string} task - The pipeline task (e.g., "text-generation", "image-classification")
 * @param {string} modelId - The model id (e.g., "Xenova/gpt2")
 * @param {Object} [options] - Optional parameters
 * @param {string} [options.cache_dir] - Custom cache directory
 * @param {string} [options.revision] - Model revision (default: 'main')
 * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
 * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype] - Override dtype
 * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device] - Override device
 * @returns {Promise<boolean>} Whether all required files are cached
 */
export function is_pipeline_cached(task: string, modelId: string, options?: {
    cache_dir?: string;
    revision?: string;
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
}): Promise<boolean>;
/**
 * Checks if all files for a specific pipeline task are already cached, with per-file detail.
 * Automatically determines which components are needed based on the task.
 *
 * @param {string} task - The pipeline task (e.g., "text-generation", "image-classification")
 * @param {string} modelId - The model id (e.g., "Xenova/gpt2")
 * @param {Object} [options] - Optional parameters
 * @param {string} [options.cache_dir] - Custom cache directory
 * @param {string} [options.revision] - Model revision (default: 'main')
 * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
 * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype] - Override dtype
 * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device] - Override device
 * @returns {Promise<CacheCheckResult>} Object with allCached boolean and files array with cache status
 */
export function is_pipeline_cached_files(task: string, modelId: string, options?: {
    cache_dir?: string;
    revision?: string;
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
}): Promise<CacheCheckResult>;
export type FileCacheStatus = {
    /**
     * - The file path
     */
    file: string;
    /**
     * - Whether the file is cached
     */
    cached: boolean;
};
export type CacheCheckResult = {
    /**
     * - Whether all files are cached
     */
    allCached: boolean;
    /**
     * - Array of files with their cache status
     */
    files: FileCacheStatus[];
};
//# sourceMappingURL=is_cached.d.ts.map