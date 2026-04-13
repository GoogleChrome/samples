declare const TextGenerationPipeline_base: new (options: TextPipelineConstructorArgs) => TextGenerationPipelineType;
/**
 * @typedef {Object} TextGenerationSingleString
 * @property {string} generated_text The generated text.
 * @typedef {TextGenerationSingleString[]} TextGenerationStringOutput
 *
 * @typedef {Object} TextGenerationSingleChat
 * @property {Chat} generated_text The generated chat.
 * @typedef {TextGenerationSingleChat[]} TextGenerationChatOutput
 *
 * @typedef {TextGenerationSingleString | TextGenerationSingleChat} TextGenerationSingle
 * @typedef {TextGenerationSingle[]} TextGenerationOutput
 *
 * @typedef {Object} TextGenerationSpecificParams Parameters specific to text-generation pipelines.
 * @property {boolean} [add_special_tokens] Whether or not to add special tokens when tokenizing the sequences.
 * @property {boolean} [return_full_text=true] If set to `false` only added text is returned, otherwise the full text is returned.
 * @property {Object} [tokenizer_encode_kwargs] Additional keyword arguments to pass along to the encoding step of the tokenizer.
 * If the text input is a chat, it is passed to `apply_chat_template`. Otherwise, it is passed to the tokenizer's call function.
 * @typedef {import('../generation/parameters.js').GenerationFunctionParameters & TextGenerationSpecificParams} TextGenerationConfig
 *
 * @callback TextGenerationPipelineCallbackString
 * @param {string} texts One prompt to complete.
 * @param {Partial<TextGenerationConfig>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<TextGenerationStringOutput>} An array containing the generated text(s).
 *
 * @callback TextGenerationPipelineCallbackChat
 * @param {Chat} texts One chat to complete.
 * @param {Partial<TextGenerationConfig>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<TextGenerationChatOutput>} An array containing the generated chat(s).
 *
 * @callback TextGenerationPipelineCallbackStringBatched
 * @param {string[]} texts Several prompts to complete.
 * @param {Partial<TextGenerationConfig>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<TextGenerationStringOutput[]>} An array of arrays, each containing the generated text(s) for the corresponding input.
 *
 * @callback TextGenerationPipelineCallbackChatBatched
 * @param {Chat[]} texts Several chats to complete.
 * @param {Partial<TextGenerationConfig>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<TextGenerationChatOutput[]>} An array of arrays, each containing the generated chat(s) for the corresponding input.
 *
 * @typedef {TextGenerationPipelineCallbackString & TextGenerationPipelineCallbackChat & TextGenerationPipelineCallbackStringBatched & TextGenerationPipelineCallbackChatBatched} TextGenerationPipelineCallback
 *
 * @typedef {TextPipelineConstructorArgs & TextGenerationPipelineCallback & Disposable} TextGenerationPipelineType
 */
/**
 * Language generation pipeline using any `ModelWithLMHead` or `ModelForCausalLM`.
 * This pipeline predicts the words that will follow a specified text prompt.
 * NOTE: For the full list of generation parameters, see [`GenerationConfig`](./utils/generation#module_utils/generation.GenerationConfig).
 *
 * **Example:** Text generation with `HuggingFaceTB/SmolLM2-135M` (default settings).
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const generator = await pipeline('text-generation', 'onnx-community/SmolLM2-135M-ONNX');
 * const text = 'Once upon a time,';
 * const output = await generator(text, { max_new_tokens: 8 });
 * // [{ generated_text: 'Once upon a time, there was a little girl named Lily.' }]
 * ```
 *
 * **Example:** Chat completion with `onnx-community/Qwen3-0.6B-ONNX`.
 * ```javascript
 * import { pipeline, TextStreamer } from '@huggingface/transformers';
 *
 * // Create a text generation pipeline
 * const generator = await pipeline(
 *   'text-generation',
 *   'onnx-community/Qwen3-0.6B-ONNX',
 *   { dtype: 'q4f16' },
 * );
 *
 * // Define the list of messages
 * const messages = [
 *   { role: 'system', content: 'You are a helpful assistant.' },
 *   { role: 'user', content: 'Write me a poem about Machine Learning.' },
 * ];
 *
 * // Generate a response
 * const output = await generator(messages, {
 *   max_new_tokens: 512,
 *   do_sample: false,
 *   streamer: new TextStreamer(generator.tokenizer, { skip_prompt: true, skip_special_tokens: true }),
 * });
 * console.log(output[0].generated_text.at(-1)?.content);
 * ```
 */
export class TextGenerationPipeline extends TextGenerationPipeline_base {
    /**
     * @param {string | string[] | import('../tokenization_utils.js').Message[] | import('../tokenization_utils.js').Message[][]} texts
     * @param {Partial<TextGenerationConfig>} generate_kwargs
     */
    _call(texts: string | string[] | import("../tokenization_utils.js").Message[] | import("../tokenization_utils.js").Message[][], generate_kwargs?: Partial<TextGenerationConfig>): Promise<TextGenerationOutput | TextGenerationOutput[]>;
}
export type TextPipelineConstructorArgs = import("./_base.js").TextPipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type Chat = import("../tokenization_utils.js").Message[];
export type TextGenerationSingleString = {
    /**
     * The generated text.
     */
    generated_text: string;
};
export type TextGenerationStringOutput = TextGenerationSingleString[];
export type TextGenerationSingleChat = {
    /**
     * The generated chat.
     */
    generated_text: Chat;
};
export type TextGenerationChatOutput = TextGenerationSingleChat[];
export type TextGenerationSingle = TextGenerationSingleString | TextGenerationSingleChat;
export type TextGenerationOutput = TextGenerationSingle[];
/**
 * Parameters specific to text-generation pipelines.
 */
export type TextGenerationSpecificParams = {
    /**
     * Whether or not to add special tokens when tokenizing the sequences.
     */
    add_special_tokens?: boolean;
    /**
     * If set to `false` only added text is returned, otherwise the full text is returned.
     */
    return_full_text?: boolean;
    /**
     * Additional keyword arguments to pass along to the encoding step of the tokenizer.
     * If the text input is a chat, it is passed to `apply_chat_template`. Otherwise, it is passed to the tokenizer's call function.
     */
    tokenizer_encode_kwargs?: any;
};
export type TextGenerationConfig = import("../generation/parameters.js").GenerationFunctionParameters & TextGenerationSpecificParams;
export type TextGenerationPipelineCallbackString = (texts: string, options?: Partial<TextGenerationConfig>) => Promise<TextGenerationStringOutput>;
export type TextGenerationPipelineCallbackChat = (texts: Chat, options?: Partial<TextGenerationConfig>) => Promise<TextGenerationChatOutput>;
export type TextGenerationPipelineCallbackStringBatched = (texts: string[], options?: Partial<TextGenerationConfig>) => Promise<TextGenerationStringOutput[]>;
export type TextGenerationPipelineCallbackChatBatched = (texts: Chat[], options?: Partial<TextGenerationConfig>) => Promise<TextGenerationChatOutput[]>;
export type TextGenerationPipelineCallback = TextGenerationPipelineCallbackString & TextGenerationPipelineCallbackChat & TextGenerationPipelineCallbackStringBatched & TextGenerationPipelineCallbackChatBatched;
export type TextGenerationPipelineType = TextPipelineConstructorArgs & TextGenerationPipelineCallback & Disposable;
export {};
//# sourceMappingURL=text-generation.d.ts.map