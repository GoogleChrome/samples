declare const QuestionAnsweringPipeline_base: new (options: TextPipelineConstructorArgs) => QuestionAnsweringPipelineType;
/**
 * @typedef {import('./_base.js').TextPipelineConstructorArgs} TextPipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 */
/**
 * @typedef {Object} QuestionAnsweringOutput
 * @property {number} score The probability associated to the answer.
 * @property {number} [start] The character start index of the answer (in the tokenized version of the input).
 * @property {number} [end] The character end index of the answer (in the tokenized version of the input).
 * @property {string} answer The answer to the question.
 *
 * @typedef {Object} QuestionAnsweringPipelineOptions Parameters specific to question answering pipelines.
 * @property {number} [top_k=1] The number of top answer predictions to be returned.
 *
 * @callback QuestionAnsweringPipelineCallbackSingleTop1 Answer the question given as input by using the context.
 * @param {string} question The question.
 * @param {string} context The context.
 * @param {{top_k: 1} | {} | undefined} [options] The options to use for question answering.
 * @returns {Promise<QuestionAnsweringOutput>} The answer.
 *
 * @callback QuestionAnsweringPipelineCallbackSingleTopK Answer the question given as input by using the context.
 * @param {string} question The question.
 * @param {string} context The context.
 * @param {{top_k: number}} [options] The options to use for question answering.
 * @returns {Promise<QuestionAnsweringOutput[]>} The answers.
 *
 * @callback QuestionAnsweringPipelineCallbackBatchTop1 Answer the questions given as inputs by using the contexts.
 * @param {string[]} question The questions.
 * @param {string[]} context The contexts.
 * @param {{top_k: 1} | {} | undefined} [options] The options to use for question answering.
 * @returns {Promise<QuestionAnsweringOutput[]>} The answers.
 *
 * @callback QuestionAnsweringPipelineCallbackBatchTopK Answer the questions given as inputs by using the contexts.
 * @param {string[]} question The questions.
 * @param {string[]} context The contexts.
 * @param {{top_k: number}} [options] The options to use for question answering.
 * @returns {Promise<QuestionAnsweringOutput[][]>} The answers.
 *
 * @typedef {QuestionAnsweringPipelineCallbackSingleTop1 & QuestionAnsweringPipelineCallbackSingleTopK & QuestionAnsweringPipelineCallbackBatchTop1 & QuestionAnsweringPipelineCallbackBatchTopK} QuestionAnsweringPipelineCallback
 *
 * @typedef {TextPipelineConstructorArgs & QuestionAnsweringPipelineCallback & Disposable} QuestionAnsweringPipelineType
 */
/**
 * Question Answering pipeline using any `ModelForQuestionAnswering`.
 *
 * **Example:** Run question answering with `Xenova/distilbert-base-uncased-distilled-squad`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const answerer = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
 * const question = 'Who was Jim Henson?';
 * const context = 'Jim Henson was a nice puppet.';
 * const output = await answerer(question, context);
 * // {
 * //   answer: "a nice puppet",
 * //   score: 0.5768911502526741
 * // }
 * ```
 */
export class QuestionAnsweringPipeline extends QuestionAnsweringPipeline_base {
    _call(question: any, context: any, { top_k }?: {
        top_k?: number;
    }): Promise<{
        answer: string;
        score: any;
    } | ({
        answer: string;
        score: any;
    } | {
        answer: string;
        score: any;
    }[])[]>;
}
export type TextPipelineConstructorArgs = import("./_base.js").TextPipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type QuestionAnsweringOutput = {
    /**
     * The probability associated to the answer.
     */
    score: number;
    /**
     * The character start index of the answer (in the tokenized version of the input).
     */
    start?: number;
    /**
     * The character end index of the answer (in the tokenized version of the input).
     */
    end?: number;
    /**
     * The answer to the question.
     */
    answer: string;
};
/**
 * Parameters specific to question answering pipelines.
 */
export type QuestionAnsweringPipelineOptions = {
    /**
     * The number of top answer predictions to be returned.
     */
    top_k?: number;
};
/**
 * Answer the question given as input by using the context.
 */
export type QuestionAnsweringPipelineCallbackSingleTop1 = (question: string, context: string, options?: {
    top_k: 1;
} | {} | undefined) => Promise<QuestionAnsweringOutput>;
/**
 * Answer the question given as input by using the context.
 */
export type QuestionAnsweringPipelineCallbackSingleTopK = (question: string, context: string, options?: {
    top_k: number;
}) => Promise<QuestionAnsweringOutput[]>;
/**
 * Answer the questions given as inputs by using the contexts.
 */
export type QuestionAnsweringPipelineCallbackBatchTop1 = (question: string[], context: string[], options?: {
    top_k: 1;
} | {} | undefined) => Promise<QuestionAnsweringOutput[]>;
/**
 * Answer the questions given as inputs by using the contexts.
 */
export type QuestionAnsweringPipelineCallbackBatchTopK = (question: string[], context: string[], options?: {
    top_k: number;
}) => Promise<QuestionAnsweringOutput[][]>;
export type QuestionAnsweringPipelineCallback = QuestionAnsweringPipelineCallbackSingleTop1 & QuestionAnsweringPipelineCallbackSingleTopK & QuestionAnsweringPipelineCallbackBatchTop1 & QuestionAnsweringPipelineCallbackBatchTopK;
export type QuestionAnsweringPipelineType = TextPipelineConstructorArgs & QuestionAnsweringPipelineCallback & Disposable;
export {};
//# sourceMappingURL=question-answering.d.ts.map