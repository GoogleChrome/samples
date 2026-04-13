/**
 * Detects which quantization levels (dtypes) are available for a model
 * by checking which ONNX files exist on the hub or locally.
 *
 * A dtype is considered available if *all* required model session files
 * exist for that dtype. For example, a Seq2Seq model needs both an encoder
 * and decoder file — the dtype is only listed if both are present.
 *
 * @param {string} modelId The model id (e.g., "onnx-community/all-MiniLM-L6-v2-ONNX")
 * @param {Object} [options] Optional parameters
 * @param {PretrainedConfig} [options.config=null] Pre-loaded model config (optional, will be fetched if not provided)
 * @param {string} [options.model_file_name=null] Override the model file name (excluding .onnx suffix)
 * @param {string} [options.revision='main'] Model revision
 * @param {string} [options.cache_dir=null] Custom cache directory
 * @param {boolean} [options.local_files_only=false] Only check local files
 * @returns {Promise<string[]>} Array of available dtype strings (e.g., ['fp32', 'fp16', 'q4', 'q8'])
 */
export function get_available_dtypes(modelId: string, { config, model_file_name, revision, cache_dir, local_files_only }?: {
    config?: PretrainedConfig;
    model_file_name?: string;
    revision?: string;
    cache_dir?: string;
    local_files_only?: boolean;
}): Promise<string[]>;
export type PretrainedConfig = import("../../configs.js").PretrainedConfig;
//# sourceMappingURL=get_available_dtypes.d.ts.map