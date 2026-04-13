import { Callable } from "@utils";
import type { TokenizerModelConfig } from "@static/tokenizer";
/**
 * Abstract base class for tokenizer models.
 */
declare abstract class TokenizerModel extends Callable<[string[]], string[]> {
    config: TokenizerModelConfig;
    vocab: string[];
    /** A mapping of tokens to ids. */
    tokens_to_ids: Map<string, number>;
    unk_token_id?: number;
    unk_token?: string;
    end_of_word_suffix?: string;
    /** Whether to fuse unknown tokens when encoding. Defaults to false. */
    fuse_unk: boolean;
    /**
     * Creates a new instance of TokenizerModel.
     * @param config The configuration object for the TokenizerModel.
     */
    constructor(config: TokenizerModelConfig);
    /**
     * Internal function to call the TokenizerModel instance.
     * @param tokens The tokens to encode.
     * @returns The encoded tokens.
     */
    _call(tokens: string[]): string[];
    /**
     * Encodes a list of tokens into a list of token IDs.
     * @param tokens The tokens to encode.
     * @returns The encoded tokens.
     */
    abstract encode(tokens: string[]): string[];
}
export default TokenizerModel;
