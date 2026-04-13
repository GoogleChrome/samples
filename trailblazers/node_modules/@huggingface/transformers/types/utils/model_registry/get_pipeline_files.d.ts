/**
 * Get all files needed for a specific pipeline task.
 * Automatically detects which components (tokenizer, processor) are needed by checking
 * whether the model has the corresponding files (tokenizer_config.json, preprocessor_config.json).
 *
 * @param {string} task - The pipeline task (e.g., "text-generation", "image-classification")
 * @param {string} modelId - The model id (e.g., "Xenova/bert-base-uncased")
 * @param {Object} [options] - Optional parameters
 * @param {import('../../configs.js').PretrainedConfig} [options.config=null] - Pre-loaded config
 * @param {import('../dtypes.js').DataType|Record<string, import('../dtypes.js').DataType>} [options.dtype=null] - Override dtype
 * @param {import('../devices.js').DeviceType|Record<string, import('../devices.js').DeviceType>} [options.device=null] - Override device
 * @param {string} [options.model_file_name=null] - Override the model file name (excluding .onnx suffix)
 * @returns {Promise<string[]>} Array of file paths that will be loaded
 * @throws {Error} If the task is not supported
 */
export function get_pipeline_files(task: string, modelId: string, options?: {
    config?: import("../../configs.js").PretrainedConfig;
    dtype?: import("../dtypes.js").DataType | Record<string, import("../dtypes.js").DataType>;
    device?: import("../devices.js").DeviceType | Record<string, import("../devices.js").DeviceType>;
    model_file_name?: string;
}): Promise<string[]>;
//# sourceMappingURL=get_pipeline_files.d.ts.map