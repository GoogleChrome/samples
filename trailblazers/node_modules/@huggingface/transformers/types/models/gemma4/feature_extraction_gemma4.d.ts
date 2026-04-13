export class Gemma4AudioFeatureExtractor extends Gemma3nAudioFeatureExtractor {
    /**
     * @override
     * Gemma4 uses semicausal padding, unfold(frame_length+1) framing, and
     * additive mel_floor — all controlled via flags on the shared spectrogram().
     */
    override _extract_fbank_features(waveform: any, max_length: any): Promise<Tensor>;
    /**
     * @override
     * Wraps the base class result with a frame-aware attention mask
     * and zeros out features for invalid (padded) frames.
     */
    override _call(audio: any, options?: {}): Promise<{
        input_features: Tensor;
        input_features_mask: Tensor;
    }>;
}
import { Gemma3nAudioFeatureExtractor } from '../gemma3n/feature_extraction_gemma3n.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=feature_extraction_gemma4.d.ts.map