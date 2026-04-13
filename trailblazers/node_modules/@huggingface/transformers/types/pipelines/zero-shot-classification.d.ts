declare const ZeroShotClassificationPipeline_base: new (options: TextPipelineConstructorArgs) => ZeroShotClassificationPipelineType;
/**
 * @typedef {import('./_base.js').TextPipelineConstructorArgs} TextPipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 */
/**
 * @typedef {Object} ZeroShotClassificationOutput
 * @property {string} sequence The sequence for which this is the output.
 * @property {string[]} labels The labels sorted by order of likelihood.
 * @property {number[]} scores The probabilities for each of the labels.
 *
 * @typedef {Object} ZeroShotClassificationPipelineOptions Parameters specific to zero-shot classification pipelines.
 * @property {string} [hypothesis_template="This example is {}."] The template used to turn each
 * candidate label into an NLI-style hypothesis. The candidate label will replace the {} placeholder.
 * @property {boolean} [multi_label=false] Whether or not multiple candidate labels can be true.
 * If `false`, the scores are normalized such that the sum of the label likelihoods for each sequence
 * is 1. If `true`, the labels are considered independent and probabilities are normalized for each
 * candidate by doing a softmax of the entailment score vs. the contradiction score.
 *
 * @callback ZeroShotClassificationPipelineCallbackSingle Classify the sequence(s) given as inputs.
 * @param {string} texts The sequence(s) to classify, will be truncated if the model input is too large.
 * @param {string|string[]} candidate_labels The set of possible class labels to classify each sequence into.
 * Can be a single label, a string of comma-separated labels, or a list of labels.
 * @param {ZeroShotClassificationPipelineOptions} [options] The options to use for zero-shot classification.
 * @returns {Promise<ZeroShotClassificationOutput>} An array or object containing the predicted labels and scores.
 *
 * @callback ZeroShotClassificationPipelineCallbackBatch Classify the sequence(s) given as inputs.
 * @param {string[]} texts The sequence(s) to classify, will be truncated if the model input is too large.
 * @param {string|string[]} candidate_labels The set of possible class labels to classify each sequence into.
 * Can be a single label, a string of comma-separated labels, or a list of labels.
 * @param {ZeroShotClassificationPipelineOptions} [options] The options to use for zero-shot classification.
 * @returns {Promise<ZeroShotClassificationOutput[]>} An array or object containing the predicted labels and scores.
 *
 * @typedef {ZeroShotClassificationPipelineCallbackSingle & ZeroShotClassificationPipelineCallbackBatch} ZeroShotClassificationPipelineCallback
 *
 * @typedef {TextPipelineConstructorArgs & ZeroShotClassificationPipelineCallback & Disposable} ZeroShotClassificationPipelineType
 */
/**
 * NLI-based zero-shot classification pipeline using a `ModelForSequenceClassification`
 * trained on NLI (natural language inference) tasks. Equivalent of `text-classification`
 * pipelines, but these models don't require a hardcoded number of potential classes, they
 * can be chosen at runtime. It usually means it's slower but it is **much** more flexible.
 *
 * **Example:** Zero shot classification with `Xenova/mobilebert-uncased-mnli`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli');
 * const text = 'Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app.';
 * const labels = [ 'mobile', 'billing', 'website', 'account access' ];
 * const output = await classifier(text, labels);
 * // {
 * //   sequence: 'Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app.',
 * //   labels: [ 'mobile', 'website', 'billing', 'account access' ],
 * //   scores: [ 0.5562091040482018, 0.1843621307860853, 0.13942646639336376, 0.12000229877234923 ]
 * // }
 * ```
 *
 * **Example:** Zero shot classification with `Xenova/nli-deberta-v3-xsmall` (multi-label).
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-xsmall');
 * const text = 'I have a problem with my iphone that needs to be resolved asap!';
 * const labels = [ 'urgent', 'not urgent', 'phone', 'tablet', 'computer' ];
 * const output = await classifier(text, labels, { multi_label: true });
 * // {
 * //   sequence: 'I have a problem with my iphone that needs to be resolved asap!',
 * //   labels: [ 'urgent', 'phone', 'computer', 'tablet', 'not urgent' ],
 * //   scores: [ 0.9958870956360275, 0.9923963400697035, 0.002333537946160235, 0.0015134138567598765, 0.0010699384208377163 ]
 * // }
 * ```
 */
export class ZeroShotClassificationPipeline extends ZeroShotClassificationPipeline_base {
    label2id: {
        [k: string]: any;
    };
    entailment_id: any;
    contradiction_id: any;
    _call(texts: any, candidate_labels: any, { hypothesis_template, multi_label }?: {
        hypothesis_template?: string;
        multi_label?: boolean;
    }): Promise<ZeroShotClassificationOutput | ZeroShotClassificationOutput[]>;
}
export type TextPipelineConstructorArgs = import("./_base.js").TextPipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ZeroShotClassificationOutput = {
    /**
     * The sequence for which this is the output.
     */
    sequence: string;
    /**
     * The labels sorted by order of likelihood.
     */
    labels: string[];
    /**
     * The probabilities for each of the labels.
     */
    scores: number[];
};
/**
 * Parameters specific to zero-shot classification pipelines.
 */
export type ZeroShotClassificationPipelineOptions = {
    /**
     * The template used to turn each
     * candidate label into an NLI-style hypothesis. The candidate label will replace the {} placeholder.
     */
    hypothesis_template?: string;
    /**
     * Whether or not multiple candidate labels can be true.
     * If `false`, the scores are normalized such that the sum of the label likelihoods for each sequence
     * is 1. If `true`, the labels are considered independent and probabilities are normalized for each
     * candidate by doing a softmax of the entailment score vs. the contradiction score.
     */
    multi_label?: boolean;
};
/**
 * Classify the sequence(s) given as inputs.
 */
export type ZeroShotClassificationPipelineCallbackSingle = (texts: string, candidate_labels: string | string[], options?: ZeroShotClassificationPipelineOptions) => Promise<ZeroShotClassificationOutput>;
/**
 * Classify the sequence(s) given as inputs.
 */
export type ZeroShotClassificationPipelineCallbackBatch = (texts: string[], candidate_labels: string | string[], options?: ZeroShotClassificationPipelineOptions) => Promise<ZeroShotClassificationOutput[]>;
export type ZeroShotClassificationPipelineCallback = ZeroShotClassificationPipelineCallbackSingle & ZeroShotClassificationPipelineCallbackBatch;
export type ZeroShotClassificationPipelineType = TextPipelineConstructorArgs & ZeroShotClassificationPipelineCallback & Disposable;
export {};
//# sourceMappingURL=zero-shot-classification.d.ts.map