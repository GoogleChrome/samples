export class VoxtralRealtimeFeatureExtractor extends FeatureExtractor {
    constructor(config: any);
    window: Float64Array<ArrayBufferLike>;
    /**
     * Computes the log-Mel spectrogram of the provided audio waveform.
     * @param {Float32Array|Float64Array} waveform The audio waveform to process.
     * @param {Object} [options]
     * @param {boolean} [options.center=true] Whether to center-pad the waveform for STFT.
     * @returns {Promise<import('../../utils/tensor.js').Tensor>} The log-Mel spectrogram tensor of shape [num_mel_bins, num_frames].
     */
    _extract_fbank_features(waveform: Float32Array | Float64Array, { center }?: {
        center?: boolean;
    }): Promise<import("../../utils/tensor.js").Tensor>;
    /**
     * Extract mel spectrogram features from audio.
     * @param {Float32Array|Float64Array} audio The audio data.
     * @param {Object} [options]
     * @param {boolean} [options.center=true] Whether to center-pad the waveform.
     * @returns {Promise<{ input_features: import('../../utils/tensor.js').Tensor }>}
     */
    _call(audio: Float32Array | Float64Array, { center }?: {
        center?: boolean;
    }): Promise<{
        input_features: import("../../utils/tensor.js").Tensor;
    }>;
}
import { FeatureExtractor } from '../../feature_extraction_utils.js';
//# sourceMappingURL=feature_extraction_voxtral_realtime.d.ts.map