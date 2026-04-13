import PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizerDigits } from "@static/tokenizer";
/**
 * Splits text based on digits.
 */
declare class Digits extends PreTokenizer {
    config: TokenizerConfigPreTokenizerDigits;
    pattern: RegExp;
    /**
     * @param config The configuration options for the pre-tokenizer.
     */
    constructor(config: TokenizerConfigPreTokenizerDigits);
    /**
     * Tokenizes text by splitting it using the given pattern.
     * @param text The text to tokenize.
     * @returns An array of tokens.
     */
    pre_tokenize_text(text: string): string[];
}
export default Digits;
