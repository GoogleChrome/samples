declare const Text2TextGenerationPipeline_base: new (options: TextPipelineConstructorArgs) => Text2TextGenerationPipelineType;
/**
 * @typedef {import('./_base.js').TextPipelineConstructorArgs} TextPipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 */
/**
 * @typedef {Object} Text2TextGenerationSingle
 * @property {string} generated_text The generated text.
 * @typedef {Text2TextGenerationSingle[]} Text2TextGenerationOutput
 *
 * @callback Text2TextGenerationPipelineCallback Generate the output text(s) using text(s) given as inputs.
 * @param {string|string[]} texts Input text for the encoder.
 * @param {Partial<import('../generation/parameters.js').GenerationFunctionParameters>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<Text2TextGenerationOutput>}
 *
 * @typedef {TextPipelineConstructorArgs & Text2TextGenerationPipelineCallback & Disposable} Text2TextGenerationPipelineType
 */
/**
 * Text2TextGenerationPipeline class for generating text using a model that performs text-to-text generation tasks.
 *
 * **Example:** Text-to-text generation w/ `Xenova/LaMini-Flan-T5-783M`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
 * const output = await generator('how can I become more healthy?', {
 *   max_new_tokens: 100,
 * });
 * // [{ generated_text: "To become more healthy, you can: 1. Eat a balanced diet with plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. 2. Stay hydrated by drinking plenty of water. 3. Get enough sleep and manage stress levels. 4. Avoid smoking and excessive alcohol consumption. 5. Regularly exercise and maintain a healthy weight. 6. Practice good hygiene and sanitation. 7. Seek medical attention if you experience any health issues." }]
 * ```
 */
export class Text2TextGenerationPipeline extends Text2TextGenerationPipeline_base {
    /** @type {'generated_text'} */
    _key: "generated_text";
    _call(texts: string | string[], options?: Partial<import("../generation/parameters.js").GenerationFunctionParameters>): Promise<Text2TextGenerationOutput>;
}
export type TextPipelineConstructorArgs = import("./_base.js").TextPipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type Text2TextGenerationSingle = {
    /**
     * The generated text.
     */
    generated_text: string;
};
export type Text2TextGenerationOutput = Text2TextGenerationSingle[];
/**
 * Generate the output text(s) using text(s) given as inputs.
 */
export type Text2TextGenerationPipelineCallback = (texts: string | string[], options?: Partial<import("../generation/parameters.js").GenerationFunctionParameters>) => Promise<Text2TextGenerationOutput>;
export type Text2TextGenerationPipelineType = TextPipelineConstructorArgs & Text2TextGenerationPipelineCallback & Disposable;
export {};
//# sourceMappingURL=text2text-generation.d.ts.map