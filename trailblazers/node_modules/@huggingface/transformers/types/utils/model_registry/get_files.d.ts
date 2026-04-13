/**
 * Returns the list of files that will be loaded for a model based on its configuration.
 * Automatically detects which files are needed (tokenizer, processor, model files).
 *
 * @param {string} modelId The model id (e.g., "Xenova/llama-2-7b")
 * @param {Object} [options] Optional parameters
 * @param {import('../../configs.js').PretrainedConfig} [options.config=null] Pre-loaded model config (optional, will be fetched if not provided)
 * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] Override dtype (use this if passing dtype to pipeline)
 * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] Override device (use this if passing device to pipeline)
 * @param {string|null} [options.model_file_name=null|null] Override the model file name (excluding .onnx suffix)
 * @param {boolean} [options.include_tokenizer=true] Whether to check for tokenizer files (set to false for vision-only models)
 * @param {boolean} [options.include_processor=true] Whether to check for processor files
 * @returns {Promise<string[]>} Array of file paths that will be loaded
 */
export function get_files(modelId: string, { config, dtype, device, model_file_name, include_tokenizer, include_processor, }?: {
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
    model_file_name?: string | null;
    include_tokenizer?: boolean;
    include_processor?: boolean;
}): Promise<string[]>;
//# sourceMappingURL=get_files.d.ts.map