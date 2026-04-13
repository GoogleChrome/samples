import { Callable } from "@utils";
import type { TokenizerConfigPostProcessor } from "@static/tokenizer";
export interface PostProcessedOutput {
    tokens: string[];
    tokens_pair?: string[];
    token_type_ids?: number[];
}
/**
 * Base class for post-processors.
 */
declare abstract class PostProcessor extends Callable<[
    string[],
    ...any[]
], PostProcessedOutput> {
    config: TokenizerConfigPostProcessor;
    /**
     * @param config The configuration for the post-processor.
     */
    constructor(config: TokenizerConfigPostProcessor);
    /**
     * Method to be implemented in subclass to apply post-processing on the given tokens.
     *
     * @param tokens The input tokens to be post-processed.
     * @param args Additional arguments required by the post-processing logic.
     * @returns The post-processed tokens.
     */
    abstract post_process(tokens: string[], ...args: any[]): PostProcessedOutput;
    /**
     * Alias for {@link PostProcessor#post_process}.
     * @param tokens The text or array of texts to post-process.
     * @param args Additional arguments required by the post-processing logic.
     * @returns The post-processed tokens.
     */
    _call(tokens: string[], ...args: any[]): PostProcessedOutput;
}
export default PostProcessor;
