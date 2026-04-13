/**
 * Helper function to create multiple InferenceSession objects.
 *
 * @param {string} pretrained_model_name_or_path The path to the directory containing the model file.
 * @param {Record<string, string>} names The names of the model files to load.
 * @param {import('../utils/hub.js').PretrainedModelOptions} options Additional options for loading the model.
 * @param {Record<string, true>} [cache_sessions] A map from session name to `true`, indicating which
 *   sessions should have GPU-pinned KV cache outputs.
 * @returns {Promise<Record<string, any>>} A Promise that resolves to a dictionary of InferenceSession objects.
 * @private
 */
export function constructSessions(pretrained_model_name_or_path: string, names: Record<string, string>, options: import("../utils/hub.js").PretrainedModelOptions, cache_sessions?: Record<string, true>): Promise<Record<string, any>>;
/**
 * Executes an InferenceSession using the specified inputs.
 * NOTE: `inputs` must contain at least the input names of the model.
 *  - If additional inputs are passed, they will be ignored.
 *  - If inputs are missing, an error will be thrown.
 *
 * @param {Object} session The InferenceSession object to run.
 * @param {Object} inputs An object that maps input names to input tensors.
 * @returns {Promise<Object>} A Promise that resolves to an object that maps output names to output tensors.
 * @private
 */
export function sessionRun(session: any, inputs: any): Promise<any>;
//# sourceMappingURL=session.d.ts.map