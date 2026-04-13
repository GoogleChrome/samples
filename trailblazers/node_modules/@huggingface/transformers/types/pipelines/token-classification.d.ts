declare const TokenClassificationPipeline_base: new (options: TextPipelineConstructorArgs) => TokenClassificationPipelineType;
/**
 * @typedef {import('./_base.js').TextPipelineConstructorArgs} TextPipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 */
/**
 * @typedef {Object} TokenClassificationSingle
 * @property {string} word The token/word classified. This is obtained by decoding the selected tokens.
 * @property {number} score The corresponding probability for `entity`.
 * @property {string} entity The entity predicted for that token/word.
 * @property {number} index The index of the corresponding token in the sentence.
 * @property {number} [start] The index of the start of the corresponding entity in the sentence.
 * @property {number} [end] The index of the end of the corresponding entity in the sentence.
 * @typedef {TokenClassificationSingle[]} TokenClassificationOutput
 *
 * @typedef {Object} TokenClassificationPipelineOptions Parameters specific to token classification pipelines.
 * @property {string[]} [ignore_labels] A list of labels to ignore.
 *
 * @callback TokenClassificationPipelineCallbackSingle Classify each token of a single text.
 * @param {string} texts The text to classify.
 * @param {TokenClassificationPipelineOptions} [options] The options to use for token classification.
 * @returns {Promise<TokenClassificationOutput>} The result.
 *
 * @callback TokenClassificationPipelineCallbackBatch Classify each token of multiple texts.
 * @param {string[]} texts The texts to classify.
 * @param {TokenClassificationPipelineOptions} [options] The options to use for token classification.
 * @returns {Promise<TokenClassificationOutput[]>} The result.
 *
 * @typedef {TokenClassificationPipelineCallbackSingle & TokenClassificationPipelineCallbackBatch} TokenClassificationPipelineCallback
 *
 * @typedef {TextPipelineConstructorArgs & TokenClassificationPipelineCallback & Disposable} TokenClassificationPipelineType
 */
/**
 * Named Entity Recognition pipeline using any `ModelForTokenClassification`.
 *
 * **Example:** Perform named entity recognition with `Xenova/bert-base-NER`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('token-classification', 'Xenova/bert-base-NER');
 * const output = await classifier('My name is Sarah and I live in London');
 * // [
 * //   { entity: 'B-PER', score: 0.9980202913284302, index: 4, word: 'Sarah' },
 * //   { entity: 'B-LOC', score: 0.9994474053382874, index: 9, word: 'London' }
 * // ]
 * ```
 *
 * **Example:** Perform named entity recognition with `Xenova/bert-base-NER` (and return all labels).
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('token-classification', 'Xenova/bert-base-NER');
 * const output = await classifier('Sarah lives in the United States of America', { ignore_labels: [] });
 * // [
 * //   { entity: 'B-PER', score: 0.9966587424278259, index: 1, word: 'Sarah' },
 * //   { entity: 'O', score: 0.9987385869026184, index: 2, word: 'lives' },
 * //   { entity: 'O', score: 0.9990072846412659, index: 3, word: 'in' },
 * //   { entity: 'O', score: 0.9988298416137695, index: 4, word: 'the' },
 * //   { entity: 'B-LOC', score: 0.9995510578155518, index: 5, word: 'United' },
 * //   { entity: 'I-LOC', score: 0.9990395307540894, index: 6, word: 'States' },
 * //   { entity: 'I-LOC', score: 0.9986724853515625, index: 7, word: 'of' },
 * //   { entity: 'I-LOC', score: 0.9975294470787048, index: 8, word: 'America' }
 * // ]
 * ```
 */
export class TokenClassificationPipeline extends TokenClassificationPipeline_base {
    _call(texts: any, { ignore_labels }?: {
        ignore_labels?: string[];
    }): Promise<{
        entity: any;
        score: any;
        index: number;
        word: string;
    }[] | {
        entity: any;
        score: any;
        index: number;
        word: string;
    }[][]>;
}
export type TextPipelineConstructorArgs = import("./_base.js").TextPipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type TokenClassificationSingle = {
    /**
     * The token/word classified. This is obtained by decoding the selected tokens.
     */
    word: string;
    /**
     * The corresponding probability for `entity`.
     */
    score: number;
    /**
     * The entity predicted for that token/word.
     */
    entity: string;
    /**
     * The index of the corresponding token in the sentence.
     */
    index: number;
    /**
     * The index of the start of the corresponding entity in the sentence.
     */
    start?: number;
    /**
     * The index of the end of the corresponding entity in the sentence.
     */
    end?: number;
};
export type TokenClassificationOutput = TokenClassificationSingle[];
/**
 * Parameters specific to token classification pipelines.
 */
export type TokenClassificationPipelineOptions = {
    /**
     * A list of labels to ignore.
     */
    ignore_labels?: string[];
};
/**
 * Classify each token of a single text.
 */
export type TokenClassificationPipelineCallbackSingle = (texts: string, options?: TokenClassificationPipelineOptions) => Promise<TokenClassificationOutput>;
/**
 * Classify each token of multiple texts.
 */
export type TokenClassificationPipelineCallbackBatch = (texts: string[], options?: TokenClassificationPipelineOptions) => Promise<TokenClassificationOutput[]>;
export type TokenClassificationPipelineCallback = TokenClassificationPipelineCallbackSingle & TokenClassificationPipelineCallbackBatch;
export type TokenClassificationPipelineType = TextPipelineConstructorArgs & TokenClassificationPipelineCallback & Disposable;
export {};
//# sourceMappingURL=token-classification.d.ts.map