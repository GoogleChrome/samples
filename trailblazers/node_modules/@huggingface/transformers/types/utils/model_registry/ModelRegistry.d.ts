/**
 * Static class for cache and file management operations.
 * @hideconstructor
 */
export class ModelRegistry {
    /**
     * Get all files (model, tokenizer, processor) needed for a model.
     *
     * @param {string} modelId - The model id (e.g., "onnx-community/bert-base-uncased-ONNX")
     * @param {Object} [options] - Optional parameters
     * @param {import('../../configs.js').PretrainedConfig} [options.config=null] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] - Override device
     * @param {string} [options.model_file_name=null] - Override the model file name (excluding .onnx suffix)
     * @param {boolean} [options.include_tokenizer=true] - Whether to check for tokenizer files
     * @param {boolean} [options.include_processor=true] - Whether to check for processor files
     * @returns {Promise<string[]>} Array of file paths
     *
     * @example
     * const files = await ModelRegistry.get_files('onnx-community/gpt2-ONNX');
     * console.log(files); // ['config.json', 'tokenizer.json', 'onnx/model_q4.onnx', ...]
     */
    static get_files(modelId: string, options?: {
        config?: import("../../configs.js").PretrainedConfig;
        dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
        device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
        model_file_name?: string;
        include_tokenizer?: boolean;
        include_processor?: boolean;
    }): Promise<string[]>;
    /**
     * Get all files needed for a specific pipeline task.
     * Automatically determines which components are needed based on the task.
     *
     * @param {string} task - The pipeline task (e.g., "text-generation", "background-removal")
     * @param {string} modelId - The model id (e.g., "onnx-community/bert-base-uncased-ONNX")
     * @param {Object} [options] - Optional parameters
     * @param {import('../../configs.js').PretrainedConfig} [options.config=null] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] - Override device
     * @param {string} [options.model_file_name=null] - Override the model file name (excluding .onnx suffix)
     * @returns {Promise<string[]>} Array of file paths
     *
     * @example
     * const files = await ModelRegistry.get_pipeline_files('text-generation', 'onnx-community/gpt2-ONNX');
     * console.log(files); // ['config.json', 'tokenizer.json', 'onnx/model_q4.onnx', ...]
     */
    static get_pipeline_files(task: string, modelId: string, options?: {
        config?: import("../../configs.js").PretrainedConfig;
        dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
        device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
        model_file_name?: string;
    }): Promise<string[]>;
    /**
     * Get model files needed for a specific model.
     *
     * @param {string} modelId - The model id
     * @param {Object} [options] - Optional parameters
     * @param {import('../../configs.js').PretrainedConfig} [options.config=null] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] - Override device
     * @param {string} [options.model_file_name=null] - Override the model file name (excluding .onnx suffix)
     * @returns {Promise<string[]>} Array of model file paths
     *
     * @example
     * const files = await ModelRegistry.get_model_files('onnx-community/bert-base-uncased-ONNX');
     * console.log(files); // ['config.json', 'onnx/model_q4.onnx', 'generation_config.json']
     */
    static get_model_files(modelId: string, options?: {
        config?: import("../../configs.js").PretrainedConfig;
        dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
        device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
        model_file_name?: string;
    }): Promise<string[]>;
    /**
     * Get tokenizer files needed for a specific model.
     *
     * @param {string} modelId - The model id
     * @returns {Promise<string[]>} Array of tokenizer file paths
     *
     * @example
     * const files = await ModelRegistry.get_tokenizer_files('onnx-community/gpt2-ONNX');
     * console.log(files); // ['tokenizer.json', 'tokenizer_config.json']
     */
    static get_tokenizer_files(modelId: string): Promise<string[]>;
    /**
     * Get processor files needed for a specific model.
     *
     * @param {string} modelId - The model id
     * @returns {Promise<string[]>} Array of processor file paths
     *
     * @example
     * const files = await ModelRegistry.get_processor_files('onnx-community/vit-base-patch16-224-ONNX');
     * console.log(files); // ['preprocessor_config.json']
     */
    static get_processor_files(modelId: string): Promise<string[]>;
    /**
     * Detects which quantization levels (dtypes) are available for a model
     * by checking which ONNX files exist on the hub or locally.
     *
     * A dtype is considered available if all required model session files
     * exist for that dtype.
     *
     * @param {string} modelId - The model id (e.g., "onnx-community/all-MiniLM-L6-v2-ONNX")
     * @param {Object} [options] - Optional parameters
     * @param {import('../../configs.js').PretrainedConfig} [options.config=null] - Pre-loaded config
     * @param {string} [options.model_file_name=null] - Override the model file name (excluding .onnx suffix)
     * @param {string} [options.revision='main'] - Model revision
     * @param {string} [options.cache_dir=null] - Custom cache directory
     * @param {boolean} [options.local_files_only=false] - Only check local files
     * @returns {Promise<string[]>} Array of available dtype strings (e.g., ['fp32', 'fp16', 'q4', 'q8'])
     *
     * @example
     * const dtypes = await ModelRegistry.get_available_dtypes('onnx-community/all-MiniLM-L6-v2-ONNX');
     * console.log(dtypes); // ['fp32', 'fp16', 'int8', 'uint8', 'q8', 'q4']
     */
    static get_available_dtypes(modelId: string, options?: {
        config?: import("../../configs.js").PretrainedConfig;
        model_file_name?: string;
        revision?: string;
        cache_dir?: string;
        local_files_only?: boolean;
    }): Promise<string[]>;
    /**
     * Quickly checks if a model is fully cached by verifying `config.json` is present,
     * then confirming all required files are cached.
     * Returns a plain boolean — use `is_cached_files` if you need per-file detail.
     *
     * @param {string} modelId - The model id
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.cache_dir] - Custom cache directory
     * @param {string} [options.revision] - Model revision (default: 'main')
     * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] - Override device
     * @returns {Promise<boolean>} Whether all required files are cached
     *
     * @example
     * const cached = await ModelRegistry.is_cached('onnx-community/bert-base-uncased-ONNX');
     * console.log(cached); // true or false
     */
    static is_cached(modelId: string, options?: {
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
     * @param {string} modelId - The model id
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.cache_dir] - Custom cache directory
     * @param {string} [options.revision] - Model revision (default: 'main')
     * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] - Override device
     * @returns {Promise<import('./is_cached.js').CacheCheckResult>} Object with allCached boolean and files array with cache status
     *
     * @example
     * const status = await ModelRegistry.is_cached_files('onnx-community/bert-base-uncased-ONNX');
     * console.log(status.allCached); // true or false
     * console.log(status.files); // [{ file: 'config.json', cached: true }, ...]
     */
    static is_cached_files(modelId: string, options?: {
        cache_dir?: string;
        revision?: string;
        config?: import("../../configs.js").PretrainedConfig;
        dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
        device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
    }): Promise<import("./is_cached.js").CacheCheckResult>;
    /**
     * Quickly checks if all files for a specific pipeline task are cached by verifying
     * `config.json` is present, then confirming all required files are cached.
     * Returns a plain boolean — use `is_pipeline_cached_files` if you need per-file detail.
     *
     * @param {string} task - The pipeline task (e.g., "text-generation", "background-removal")
     * @param {string} modelId - The model id
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.cache_dir] - Custom cache directory
     * @param {string} [options.revision] - Model revision (default: 'main')
     * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] - Override device
     * @returns {Promise<boolean>} Whether all required files are cached
     *
     * @example
     * const cached = await ModelRegistry.is_pipeline_cached('text-generation', 'onnx-community/gpt2-ONNX');
     * console.log(cached); // true or false
     */
    static is_pipeline_cached(task: string, modelId: string, options?: {
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
     * @param {string} task - The pipeline task (e.g., "text-generation", "background-removal")
     * @param {string} modelId - The model id
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.cache_dir] - Custom cache directory
     * @param {string} [options.revision] - Model revision (default: 'main')
     * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] - Override device
     * @returns {Promise<import('./is_cached.js').CacheCheckResult>} Object with allCached boolean and files array with cache status
     *
     * @example
     * const status = await ModelRegistry.is_pipeline_cached_files('text-generation', 'onnx-community/gpt2-ONNX');
     * console.log(status.allCached); // true or false
     * console.log(status.files); // [{ file: 'config.json', cached: true }, ...]
     */
    static is_pipeline_cached_files(task: string, modelId: string, options?: {
        cache_dir?: string;
        revision?: string;
        config?: import("../../configs.js").PretrainedConfig;
        dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
        device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
    }): Promise<import("./is_cached.js").CacheCheckResult>;
    /**
     * Get metadata for a specific file without downloading it.
     *
     * @param {string} path_or_repo_id - Model id or path
     * @param {string} filename - The file name
     * @param {import('../hub.js').PretrainedOptions} [options] - Optional parameters
     * @returns {Promise<{exists: boolean, size?: number, contentType?: string, fromCache?: boolean}>} File metadata
     *
     * @example
     * const metadata = await ModelRegistry.get_file_metadata('onnx-community/gpt2-ONNX', 'config.json');
     * console.log(metadata.exists, metadata.size); // true, 665
     */
    static get_file_metadata(path_or_repo_id: string, filename: string, options?: import("../hub.js").PretrainedOptions): Promise<{
        exists: boolean;
        size?: number;
        contentType?: string;
        fromCache?: boolean;
    }>;
    /**
     * Clears all cached files for a given model.
     * Automatically determines which files are needed and removes them from the cache.
     *
     * @param {string} modelId - The model id (e.g., "onnx-community/gpt2-ONNX")
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.cache_dir] - Custom cache directory
     * @param {string} [options.revision] - Model revision (default: 'main')
     * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device] - Override device
     * @param {boolean} [options.include_tokenizer=true] - Whether to clear tokenizer files
     * @param {boolean} [options.include_processor=true] - Whether to clear processor files
     * @returns {Promise<import('./clear_cache.js').CacheClearResult>} Object with deletion statistics and file status
     *
     * @example
     * const result = await ModelRegistry.clear_cache('onnx-community/bert-base-uncased-ONNX');
     * console.log(`Deleted ${result.filesDeleted} of ${result.filesCached} cached files`);
     */
    static clear_cache(modelId: string, options?: {
        cache_dir?: string;
        revision?: string;
        config?: import("../../configs.js").PretrainedConfig;
        dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
        device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
        include_tokenizer?: boolean;
        include_processor?: boolean;
    }): Promise<import("./clear_cache.js").CacheClearResult>;
    /**
     * Clears all cached files for a specific pipeline task.
     * Automatically determines which components are needed based on the task.
     *
     * @param {string} task - The pipeline task (e.g., "text-generation", "image-classification")
     * @param {string} modelId - The model id (e.g., "onnx-community/gpt2-ONNX")
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.cache_dir] - Custom cache directory
     * @param {string} [options.revision] - Model revision (default: 'main')
     * @param {import('../../configs.js').PretrainedConfig} [options.config] - Pre-loaded config
     * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype] - Override dtype
     * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device] - Override device
     * @returns {Promise<import('./clear_cache.js').CacheClearResult>} Object with deletion statistics and file status
     *
     * @example
     * const result = await ModelRegistry.clear_pipeline_cache('text-generation', 'onnx-community/gpt2-ONNX');
     * console.log(`Deleted ${result.filesDeleted} of ${result.filesCached} cached files`);
     */
    static clear_pipeline_cache(task: string, modelId: string, options?: {
        cache_dir?: string;
        revision?: string;
        config?: import("../../configs.js").PretrainedConfig;
        dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
        device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
    }): Promise<import("./clear_cache.js").CacheClearResult>;
}
//# sourceMappingURL=ModelRegistry.d.ts.map