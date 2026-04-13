/**
 * @typedef {import('../../configs.js').PretrainedConfig} PretrainedConfig
 */
/**
 * Returns a memoized AutoConfig for the given model ID and options.
 * If the same model ID and options have been requested before — even while
 * the first request is still in-flight — the cached promise is returned
 * so that config.json is only fetched once.
 * When a pre-loaded `config` object is supplied the result is not memoized,
 * since the caller already has the config and no network operation is performed.
 *
 * @param {string} modelId The model id (e.g., "onnx-community/granite-4.0-350m-ONNX-web")
 * @param {Object} [options]
 * @param {PretrainedConfig|null} [options.config=null] Pre-loaded config; skips fetching if provided.
 * @param {string|null} [options.cache_dir=null] Custom local cache directory.
 * @param {boolean} [options.local_files_only=false] Never hit the network if true.
 * @param {string} [options.revision='main'] Git branch, tag, or commit SHA.
 * @returns {Promise<PretrainedConfig>}
 */
export function get_config(modelId: string, { config, cache_dir, local_files_only, revision }?: {
    config?: PretrainedConfig | null;
    cache_dir?: string | null;
    local_files_only?: boolean;
    revision?: string;
}): Promise<PretrainedConfig>;
/**
 * Returns the list of files that will be loaded for a model based on its configuration.
 *
 * This function reads configuration from the model's config.json on the hub.
 * If dtype/device are not specified in the config, you can provide them to match
 * what the pipeline will actually use.
 *
 * @param {string} modelId The model id (e.g., "onnx-community/granite-4.0-350m-ONNX-web")
 * @param {Object} [options] Optional parameters
 * @param {import('../../configs.js').PretrainedConfig} [options.config=null] Pre-loaded model config (optional, will be fetched if not provided)
 * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] Override dtype (use this if passing dtype to pipeline)
 * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] Override device (use this if passing device to pipeline)
 * @param {string} [options.model_file_name=null] Override the model file name (excluding .onnx suffix).
 * @returns {Promise<string[]>} Array of file paths that will be loaded
 */
export function get_model_files(modelId: string, { config, dtype: overrideDtype, device: overrideDevice, model_file_name }?: {
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
    model_file_name?: string;
}): Promise<string[]>;
export type PretrainedConfig = import("../../configs.js").PretrainedConfig;
//# sourceMappingURL=get_model_files.d.ts.map