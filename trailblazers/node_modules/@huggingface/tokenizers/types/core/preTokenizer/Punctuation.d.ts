import PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizerPunctuation } from "@static/tokenizer";
/**
 * Splits text based on punctuation.
 */
declare class Punctuation extends PreTokenizer {
    config: TokenizerConfigPreTokenizerPunctuation;
    pattern: RegExp;
    /**
     * @param config The configuration options for the pre-tokenizer.
     */
    constructor(config: TokenizerConfigPreTokenizerPunctuation);
    /**
     * Tokenizes text by splitting it using the given pattern.
     * @param text The text to tokenize.
     * @returns An array of tokens.
     */
    pre_tokenize_text(text: string): string[];
}
export default Punctuation;
