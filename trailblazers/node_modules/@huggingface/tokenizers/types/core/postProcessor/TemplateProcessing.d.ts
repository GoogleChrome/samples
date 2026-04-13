import PostProcessor, { type PostProcessedOutput } from "../PostProcessor";
import type { TokenizerConfigPostProcessorTemplateProcessing } from "@static/tokenizer";
/**
 * Post processor that replaces special tokens in a template with actual tokens.
 */
declare class TemplateProcessing extends PostProcessor {
    config: TokenizerConfigPostProcessorTemplateProcessing;
    /**
     * Replaces special tokens in the template with actual tokens.
     * @param tokens The list of tokens for the first sequence.
     * @param tokens_pair The list of tokens for the second sequence (optional).
     * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
     * @returns An object containing the list of tokens with the special tokens replaced with actual tokens.
     */
    post_process(tokens: string[], tokens_pair?: string[], add_special_tokens?: boolean): PostProcessedOutput;
}
export default TemplateProcessing;
