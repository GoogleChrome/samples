declare const ZeroShotAudioClassificationPipeline_base: new (options: TextAudioPipelineConstructorArgs) => ZeroShotAudioClassificationPipelineType;
/**
 * @typedef {import('./_base.js').TextAudioPipelineConstructorArgs} TextAudioPipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').AudioInput} AudioInput
 */
/**
 * @typedef {Object} ZeroShotAudioClassificationOutputSingle
 * @property {string} label The label identified by the model. It is one of the suggested `candidate_label`.
 * @property {number} score The score attributed by the model for that label (between 0 and 1).
 *
 * @typedef {ZeroShotAudioClassificationOutputSingle[]} ZeroShotAudioClassificationOutput
 *
 * @typedef {Object} ZeroShotAudioClassificationPipelineOptions Parameters specific to zero-shot audio classification pipelines.
 * @property {string} [hypothesis_template="This is a sound of {}."] The sentence used in conjunction with `candidate_labels`
 * to attempt the audio classification by replacing the placeholder with the candidate_labels.
 * Then likelihood is estimated by using `logits_per_audio`.
 *
 * @callback ZeroShotAudioClassificationPipelineCallbackSingle Classify the sequence(s) given as inputs.
 * @param {AudioInput} audio The input audio file(s) to be classified. The input is either:
 * - `string` or `URL` that is the filename/URL of the audio file, the file will be read at the processor's sampling rate
 * to get the waveform using the [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) API.
 * If `AudioContext` is not available, you should pass the raw waveform in as a Float32Array of shape `(n, )`.
 * - `Float32Array` or `Float64Array` of shape `(n, )`, representing the raw audio at the correct sampling rate (no further check will be done).
 * @param {string[]} candidate_labels The candidate labels for this audio.
 * @param {ZeroShotAudioClassificationPipelineOptions} [options] The options to use for zero-shot audio classification.
 * @returns {Promise<ZeroShotAudioClassificationOutput>} An array of objects containing the predicted labels and scores.
 *
 * @callback ZeroShotAudioClassificationPipelineCallbackBatch Classify the sequence(s) given as inputs.
 * @param {AudioInput[]} audio The input audio file(s) to be classified. The input is either:
 * - `string` or `URL` that is the filename/URL of the audio file, the file will be read at the processor's sampling rate
 * to get the waveform using the [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) API.
 * If `AudioContext` is not available, you should pass the raw waveform in as a Float32Array of shape `(n, )`.
 * - `Float32Array` or `Float64Array` of shape `(n, )`, representing the raw audio at the correct sampling rate (no further check will be done).
 * @param {string[]} candidate_labels The candidate labels for this audio.
 * @param {ZeroShotAudioClassificationPipelineOptions} [options] The options to use for zero-shot audio classification.
 * @returns {Promise<ZeroShotAudioClassificationOutput[]>} An array of objects containing the predicted labels and scores.
 *
 * @typedef {ZeroShotAudioClassificationPipelineCallbackSingle & ZeroShotAudioClassificationPipelineCallbackBatch} ZeroShotAudioClassificationPipelineCallback
 *
 * @typedef {TextAudioPipelineConstructorArgs & ZeroShotAudioClassificationPipelineCallback & Disposable} ZeroShotAudioClassificationPipelineType
 */
/**
 * Zero shot audio classification pipeline using `ClapModel`. This pipeline predicts the class of an audio when you
 * provide an audio and a set of `candidate_labels`.
 *
 * **Example**: Perform zero-shot audio classification with `Xenova/clap-htsat-unfused`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('zero-shot-audio-classification', 'Xenova/clap-htsat-unfused');
 * const audio = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/dog_barking.wav';
 * const candidate_labels = ['dog', 'vaccum cleaner'];
 * const scores = await classifier(audio, candidate_labels);
 * // [
 * //   { score: 0.9993992447853088, label: 'dog' },
 * //   { score: 0.0006007603369653225, label: 'vaccum cleaner' }
 * // ]
 * ```
 */
export class ZeroShotAudioClassificationPipeline extends ZeroShotAudioClassificationPipeline_base {
    _call(audio: any, candidate_labels: any, { hypothesis_template }?: {
        hypothesis_template?: string;
    }): Promise<{
        score: any;
        label: any;
    }[] | {
        score: any;
        label: any;
    }[][]>;
}
export type TextAudioPipelineConstructorArgs = import("./_base.js").TextAudioPipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type AudioInput = import("./_base.js").AudioInput;
export type ZeroShotAudioClassificationOutputSingle = {
    /**
     * The label identified by the model. It is one of the suggested `candidate_label`.
     */
    label: string;
    /**
     * The score attributed by the model for that label (between 0 and 1).
     */
    score: number;
};
export type ZeroShotAudioClassificationOutput = ZeroShotAudioClassificationOutputSingle[];
/**
 * Parameters specific to zero-shot audio classification pipelines.
 */
export type ZeroShotAudioClassificationPipelineOptions = {
    /**
     * The sentence used in conjunction with `candidate_labels`
     * to attempt the audio classification by replacing the placeholder with the candidate_labels.
     * Then likelihood is estimated by using `logits_per_audio`.
     */
    hypothesis_template?: string;
};
/**
 * Classify the sequence(s) given as inputs.
 */
export type ZeroShotAudioClassificationPipelineCallbackSingle = (audio: AudioInput, candidate_labels: string[], options?: ZeroShotAudioClassificationPipelineOptions) => Promise<ZeroShotAudioClassificationOutput>;
/**
 * Classify the sequence(s) given as inputs.
 */
export type ZeroShotAudioClassificationPipelineCallbackBatch = (audio: AudioInput[], candidate_labels: string[], options?: ZeroShotAudioClassificationPipelineOptions) => Promise<ZeroShotAudioClassificationOutput[]>;
export type ZeroShotAudioClassificationPipelineCallback = ZeroShotAudioClassificationPipelineCallbackSingle & ZeroShotAudioClassificationPipelineCallbackBatch;
export type ZeroShotAudioClassificationPipelineType = TextAudioPipelineConstructorArgs & ZeroShotAudioClassificationPipelineCallback & Disposable;
export {};
//# sourceMappingURL=zero-shot-audio-classification.d.ts.map