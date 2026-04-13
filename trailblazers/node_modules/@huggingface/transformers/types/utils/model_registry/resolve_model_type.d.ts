/**
 * @typedef {import('../../configs.js').PretrainedConfig} PretrainedConfig
 */
/**
 * Resolves the model type (e.g., EncoderOnly, DecoderOnly, Seq2Seq, …) from a
 * model config by checking architectures and model_type against the known
 * MODEL_TYPE_MAPPING.
 *
 * Resolution order:
 *   1. `config.architectures` entries looked up in MODEL_TYPE_MAPPING
 *   2. `config.model_type` looked up directly in MODEL_TYPE_MAPPING
 *   3. `config.model_type` looked up via MODEL_MAPPING_NAMES → architecture → MODEL_TYPE_MAPPING
 *   4. Fallback to `MODEL_TYPES.EncoderOnly`
 *
 * @param {PretrainedConfig} config The model config object.
 * @param {{ warn?: boolean }} [options] Set `warn` to false to suppress the
 *   fallback warning (defaults to true).
 * @returns {number} One of the MODEL_TYPES enum values.
 */
export function resolve_model_type(config: PretrainedConfig, { warn }?: {
    warn?: boolean;
}): number;
export type PretrainedConfig = import("../../configs.js").PretrainedConfig;
//# sourceMappingURL=resolve_model_type.d.ts.map