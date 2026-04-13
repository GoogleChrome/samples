import PostProcessor, { type PostProcessedOutput } from "../PostProcessor";
import type { TokenizerConfigPostProcessorBert } from "@static/tokenizer";
/**
 * A post-processor that adds special tokens to the beginning and end of the input.
 */
declare class BertProcessing extends PostProcessor {
    sep: [string, number];
    cls: [string, number];
    /**
     * @param config The configuration for the post-processor.
     * @param config.cls The special tokens to add to the beginning of the input.
     * @param config.sep The special tokens to add to the end of the input.
     */
    constructor(config: TokenizerConfigPostProcessorBert);
    /**
     * Adds the special tokens to the beginning and end of the input.
     * @param tokens The input tokens.
     * @param tokens_pair An optional second set of input tokens.
     * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
     * @returns The post-processed tokens with the special tokens added to the beginning and end.
     */
    post_process(tokens: string[], tokens_pair?: string[], add_special_tokens?: boolean): PostProcessedOutput;
}
export default BertProcessing;
