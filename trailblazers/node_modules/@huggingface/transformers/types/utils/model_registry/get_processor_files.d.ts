/**
 * Returns the list of processor files that will be loaded for a model.
 * Auto-detects if the model has a processor by checking if preprocessor_config.json exists.
 *
 * @param {string} modelId The model id (e.g., "Xenova/detr-resnet-50")
 * @returns {Promise<string[]>} Array of processor file names (empty if no processor)
 */
export function get_processor_files(modelId: string): Promise<string[]>;
//# sourceMappingURL=get_processor_files.d.ts.map