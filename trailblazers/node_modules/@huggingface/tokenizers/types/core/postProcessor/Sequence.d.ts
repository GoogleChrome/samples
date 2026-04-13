import PostProcessor, { type PostProcessedOutput } from "../PostProcessor";
import type { TokenizerConfigPostProcessorSequence } from "@static/tokenizer";
/**
 * A post-processor that applies multiple post-processors in sequence.
 */
declare class Sequence extends PostProcessor {
    processors: PostProcessor[];
    /**
     * Creates a new instance of Sequence post-processor.
     * @param config The configuration object.
     */
    constructor(config: TokenizerConfigPostProcessorSequence);
    /**
     * Post process the given tokens.
     * @param tokens The list of tokens for the first sequence.
     * @param tokens_pair The list of tokens for the second sequence (optional).
     * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
     * @returns An object containing the post-processed tokens.
     */
    post_process(tokens: string[], tokens_pair?: string[], add_special_tokens?: boolean): PostProcessedOutput;
}
export default Sequence;
