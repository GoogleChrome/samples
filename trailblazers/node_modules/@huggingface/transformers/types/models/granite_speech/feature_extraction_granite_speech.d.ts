export class GraniteSpeechFeatureExtractor extends FeatureExtractor {
    constructor(config: any);
    mel_filters: number[][];
    window: Float64Array<any>;
    /**
     * Extract mel spectrogram features from audio, matching the Python GraniteSpeechFeatureExtractor.
     * @param {Float32Array|Float64Array} audio The audio waveform.
     * @returns {Promise<{input_features: Tensor}>}
     */
    _call(audio: Float32Array | Float64Array): Promise<{
        input_features: Tensor;
    }>;
}
import { FeatureExtractor } from '../../feature_extraction_utils.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=feature_extraction_granite_speech.d.ts.map