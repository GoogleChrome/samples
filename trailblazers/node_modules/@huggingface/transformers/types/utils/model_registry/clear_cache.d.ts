/**
 * Clears all cached files for a given model.
 * Automatically determines which files are needed using get_files().
 *
 * @param {string} modelId - The model id (e.g., "Xenova/gpt2")
 * @param {Object} [options] - Optional parameters
 * @param {string} [options.cache_dir] - Custom cache directory
 * @param {string} [options.revision] - Model revision (default: 'main')
 * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
 * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype] - Override dtype
 * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device] - Override device
 * @param {boolean} [options.include_tokenizer=true] - Whether to clear tokenizer files
 * @param {boolean} [options.include_processor=true] - Whether to clear processor files
 * @returns {Promise<CacheClearResult>} Object with deletion statistics and file status
 */
export function clear_cache(modelId: string, options?: {
    cache_dir?: string;
    revision?: string;
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
    include_tokenizer?: boolean;
    include_processor?: boolean;
}): Promise<CacheClearResult>;
/**
 * Clears all cached files for a specific pipeline task.
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
 * @returns {Promise<CacheClearResult>} Object with deletion statistics and file status
 */
export function clear_pipeline_cache(task: string, modelId: string, options?: {
    cache_dir?: string;
    revision?: string;
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
}): Promise<CacheClearResult>;
export type FileClearStatus = {
    /**
     * - The file path
     */
    file: string;
    /**
     * - Whether the file was successfully deleted
     */
    deleted: boolean;
    /**
     * - Whether the file was cached before deletion
     */
    wasCached: boolean;
};
export type CacheClearResult = {
    /**
     * - Number of files successfully deleted
     */
    filesDeleted: number;
    /**
     * - Number of files that were in cache
     */
    filesCached: number;
    /**
     * - Array of files with their deletion status
     */
    files: FileClearStatus[];
};
//# sourceMappingURL=clear_cache.d.ts.map