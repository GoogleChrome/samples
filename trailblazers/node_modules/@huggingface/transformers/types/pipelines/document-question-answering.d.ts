declare const DocumentQuestionAnsweringPipeline_base: new (options: TextImagePipelineConstructorArgs) => DocumentQuestionAnsweringPipelineType;
/**
 * @typedef {import('./_base.js').TextImagePipelineConstructorArgs} TextImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImageInput} ImageInput
 */
/**
 * @typedef {Object} DocumentQuestionAnsweringSingle
 * @property {string} answer The generated text.
 * @typedef {DocumentQuestionAnsweringSingle[]} DocumentQuestionAnsweringOutput
 *
 * @callback DocumentQuestionAnsweringPipelineCallback Answer the question given as input by using the document.
 * @param {ImageInput|ImageInput[]} image The image of the document to use.
 * @param {string} question A question to ask of the document.
 * @param {Partial<import('../generation/parameters.js').GenerationFunctionParameters>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<DocumentQuestionAnsweringOutput>} An object (or array of objects) containing the answer(s).
 *
 * @typedef {TextImagePipelineConstructorArgs & DocumentQuestionAnsweringPipelineCallback & Disposable} DocumentQuestionAnsweringPipelineType
 */
/**
 * Document Question Answering pipeline using any `AutoModelForDocumentQuestionAnswering`.
 * The inputs/outputs are similar to the (extractive) question answering pipeline; however,
 * the pipeline takes an image (and optional OCR'd words/boxes) as input instead of text context.
 *
 * **Example:** Answer questions about a document with `Xenova/donut-base-finetuned-docvqa`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const qa_pipeline = await pipeline('document-question-answering', 'Xenova/donut-base-finetuned-docvqa');
 * const image = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/invoice.png';
 * const question = 'What is the invoice number?';
 * const output = await qa_pipeline(image, question);
 * // [{ answer: 'us-001' }]
 * ```
 */
export class DocumentQuestionAnsweringPipeline extends DocumentQuestionAnsweringPipeline_base {
    _call(image: any, question: any, generate_kwargs?: {}): Promise<{
        answer: string;
    }[]>;
}
export type TextImagePipelineConstructorArgs = import("./_base.js").TextImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImageInput = import("./_base.js").ImageInput;
export type DocumentQuestionAnsweringSingle = {
    /**
     * The generated text.
     */
    answer: string;
};
export type DocumentQuestionAnsweringOutput = DocumentQuestionAnsweringSingle[];
/**
 * Answer the question given as input by using the document.
 */
export type DocumentQuestionAnsweringPipelineCallback = (image: ImageInput | ImageInput[], question: string, options?: Partial<import("../generation/parameters.js").GenerationFunctionParameters>) => Promise<DocumentQuestionAnsweringOutput>;
export type DocumentQuestionAnsweringPipelineType = TextImagePipelineConstructorArgs & DocumentQuestionAnsweringPipelineCallback & Disposable;
export {};
//# sourceMappingURL=document-question-answering.d.ts.map