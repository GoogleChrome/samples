export class VoxtralRealtimeProcessor extends Processor {
    static tokenizer_class: typeof AutoTokenizer;
    static feature_extractor_class: typeof AutoFeatureExtractor;
    /** Number of mel frames in the first audio chunk. */
    get num_mel_frames_first_audio_chunk(): number;
    /** Number of raw audio samples in the first audio chunk. */
    get num_samples_first_audio_chunk(): number;
    /** Number of raw audio samples per subsequent audio chunk. */
    get num_samples_per_audio_chunk(): any;
    /** Number of right-pad tokens for non-streaming mode. */
    get num_right_pad_tokens(): number;
    /** Number of mel frames per text token. */
    get audio_length_per_tok(): number;
    /** Number of raw audio samples per token. */
    get raw_audio_length_per_tok(): number;
    /**
     * Process audio input for VoxtralRealtime.
     *
     * In streaming mode with `is_first_audio_chunk=true`, the audio is left-padded
     * with silence and mel features are extracted with `center=true`.
     * Returns `{ input_ids, input_features }`.
     *
     * In streaming mode with `is_first_audio_chunk=false`, the audio chunk is
     * processed with `center=false` and only `{ input_features }` is returned.
     *
     * In non-streaming mode, the audio is right-padded to ensure the model
     * transcribes the full audio, then processed with `center=true`.
     * Returns `{ input_features }`.
     *
     * @param {Float32Array|Float64Array} audio The audio waveform.
     * @param {Object} [options]
     * @param {boolean} [options.is_streaming=false] Whether processing in streaming mode.
     * @param {boolean} [options.is_first_audio_chunk=true] Whether this is the first audio chunk.
     * @returns {Promise<Object>}
     */
    _call(audio: Float32Array | Float64Array, { is_streaming, is_first_audio_chunk }?: {
        is_streaming?: boolean;
        is_first_audio_chunk?: boolean;
    }): Promise<any>;
}
import { Processor } from '../../processing_utils.js';
import { AutoTokenizer } from '../auto/tokenization_auto.js';
import { AutoFeatureExtractor } from '../auto/feature_extraction_auto.js';
//# sourceMappingURL=processing_voxtral_realtime.d.ts.map