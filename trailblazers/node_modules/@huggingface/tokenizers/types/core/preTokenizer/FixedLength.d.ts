import PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizerFixedLength } from "@static/tokenizer";
/**
 * Splits into fixed-length tokens.
 */
declare class FixedLength extends PreTokenizer {
    config: TokenizerConfigPreTokenizerFixedLength;
    private _length;
    /**
     * @param config The configuration options for the pre-tokenizer.
     */
    constructor(config: TokenizerConfigPreTokenizerFixedLength);
    /**
     * Pre-tokenizes the input text by splitting it into fixed-length tokens.
     * @param text The text to be pre-tokenized.
     * @returns An array of tokens produced by splitting the input text into fixed-length tokens.
     */
    pre_tokenize_text(text: string): string[];
}
export default FixedLength;
