/**
 * Returns the text-only session names for a given model type, or `null` if
 * the model type does not define a text-only session set.
 * @param {number} modelType The model type enum value.
 * @returns {Record<string, string>|null}
 */
export function getTextOnlySessions(modelType: number): Record<string, string> | null;
/**
 * Get the session configuration for a given model type.
 * @param {number} modelType The model type enum value.
 * @param {Object} config The model config.
 * @param {Object} [options] Loading options.
 * @returns {{ sessions: Record<string, string>, cache_sessions?: Record<string, true>, optional_configs?: Record<string, string> }}
 */
export function getSessionsConfig(modelType: number, config: any, options?: any): {
    sessions: Record<string, string>;
    cache_sessions?: Record<string, true>;
    optional_configs?: Record<string, string>;
};
export namespace MODEL_TYPES {
    let EncoderOnly: number;
    let EncoderDecoder: number;
    let Seq2Seq: number;
    let Vision2Seq: number;
    let DecoderOnly: number;
    let DecoderOnlyWithoutHead: number;
    let MaskGeneration: number;
    let ImageTextToText: number;
    let Musicgen: number;
    let MultiModality: number;
    let Phi3V: number;
    let AudioTextToText: number;
    let AutoEncoder: number;
    let ImageAudioTextToText: number;
    let Supertonic: number;
    let Chatterbox: number;
    let VoxtralRealtime: number;
}
export const MODEL_SESSION_CONFIG: any;
//# sourceMappingURL=session_config.d.ts.map