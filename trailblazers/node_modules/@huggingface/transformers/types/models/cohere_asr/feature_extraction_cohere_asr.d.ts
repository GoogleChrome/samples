export class CohereAsrFeatureExtractor extends ParakeetFeatureExtractor {
    /**
     * Apply deterministic dithering seeded by the waveform length.
     * @param {Float64Array} waveform
     * @returns {Float64Array} The dithered waveform (mutated in-place).
     */
    _apply_dither(waveform: Float64Array): Float64Array;
    /**
     * Split audio into chunks at energy-based boundaries for long audio.
     * @param {Float32Array|Float64Array} audio The raw audio waveform.
     * @returns {(Float32Array|Float64Array)[]} Array of audio chunks.
     */
    split_audio(audio: Float32Array | Float64Array): (Float32Array | Float64Array)[];
    /**
     * Find the quietest point (minimum energy) within a segment of audio.
     * @param {Float32Array|Float64Array} waveform
     * @param {number} start_idx
     * @param {number} end_idx
     * @param {number} window_size
     * @returns {number} Index of the quietest point.
     */
    _find_split_point_energy(waveform: Float32Array | Float64Array, start_idx: number, end_idx: number, window_size: number): number;
}
import { ParakeetFeatureExtractor } from '../parakeet/feature_extraction_parakeet.js';
//# sourceMappingURL=feature_extraction_cohere_asr.d.ts.map