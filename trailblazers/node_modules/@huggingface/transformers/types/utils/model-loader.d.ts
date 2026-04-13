/**
 * Resolves an `use_external_data_format` config value to the number of data chunks for a given file.
 * @param {import('./hub.js').ExternalData|Record<string, import('./hub.js').ExternalData>|null|undefined} config The external data format configuration.
 * @param {string} fullName The full ONNX file name (e.g., "model_quantized.onnx").
 * @param {string} fileName The base file name (e.g., "model").
 * @returns {number} The number of external data chunks (0 if none).
 */
export function resolveExternalDataFormat(config: import("./hub.js").ExternalData | Record<string, import("./hub.js").ExternalData> | null | undefined, fullName: string, fileName: string): number;
/**
 * Generates the file names for external data chunks.
 * @param {string} fullName The full ONNX file name (e.g., "model_quantized.onnx").
 * @param {number} numChunks The number of external data chunks.
 * @returns {string[]} Array of external data file names.
 */
export function getExternalDataChunkNames(fullName: string, numChunks: number): string[];
/**
 * Loads the core model file.
 *
 * @param {string} pretrained_model_name_or_path The path to the directory containing the model file.
 * @param {string} fileName The base name of the model file (without suffix or extension).
 * @param {import('./hub.js').PretrainedModelOptions} options Additional options for loading the model.
 * @param {string} suffix The suffix to append to the file name (e.g., '_q4', '_quantized').
 * @returns {Promise<string|Uint8Array>} A Promise that resolves to the model file buffer or path.
 */
export function getCoreModelFile(pretrained_model_name_or_path: string, fileName: string, options: import("./hub.js").PretrainedModelOptions, suffix: string): Promise<string | Uint8Array>;
/**
 * Loads external data files for a model.
 *
 * @param {string} pretrained_model_name_or_path The path to the directory containing the model files.
 * @param {string} fileName The base name of the model file (without suffix or extension).
 * @param {string} suffix The suffix to append to the file name (e.g., '_q4').
 * @param {import('./hub.js').PretrainedModelOptions} options Additional options for loading the model.
 * @param {import('./hub.js').ExternalData|Record<string, import('./hub.js').ExternalData>|undefined} use_external_data_format External data format configuration.
 * @param {any} [session_options] Optional session options that may contain externalData configuration.
 * @returns {Promise<Array<string|{path: string, data: Uint8Array}>>} A Promise that resolves to an array of external data files.
 */
export function getModelDataFiles(pretrained_model_name_or_path: string, fileName: string, suffix: string, options: import("./hub.js").PretrainedModelOptions, use_external_data_format: import("./hub.js").ExternalData | Record<string, import("./hub.js").ExternalData> | undefined, session_options?: any): Promise<Array<string | {
    path: string;
    data: Uint8Array;
}>>;
//# sourceMappingURL=model-loader.d.ts.map