import PostProcessor, { type PostProcessedOutput } from "../PostProcessor";
/**
 * A PostProcessor that returns the given tokens as is.
 */
declare class ByteLevel extends PostProcessor {
    /**
     * Post process the given tokens.
     * @param tokens The list of tokens for the first sequence.
     * @param tokens_pair The list of tokens for the second sequence (optional).
     * @returns An object containing the post-processed tokens.
     */
    post_process(tokens: string[], tokens_pair?: string[]): PostProcessedOutput;
}
export default ByteLevel;
