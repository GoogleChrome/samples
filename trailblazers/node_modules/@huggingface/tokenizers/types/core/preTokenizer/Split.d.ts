import PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizerSplit } from "@static/tokenizer";
/**
 * Splits text using a given pattern.
 */
declare class Split extends PreTokenizer {
    config: TokenizerConfigPreTokenizerSplit;
    pattern: RegExp | null;
    /**
     * @param config The configuration options for the pre-tokenizer.
     */
    constructor(config: TokenizerConfigPreTokenizerSplit);
    /**
     * Tokenizes text by splitting it using the given pattern.
     * @param text The text to tokenize.
     * @returns An array of tokens.
     */
    pre_tokenize_text(text: string): string[];
}
export default Split;
