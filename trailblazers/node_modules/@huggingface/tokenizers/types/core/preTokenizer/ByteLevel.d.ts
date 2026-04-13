import PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizerByteLevel } from "@static/tokenizer";
/**
 * A pre-tokenizer that splits text into Byte-Pair-Encoding (BPE) subwords.
 */
declare class ByteLevel extends PreTokenizer {
    config: TokenizerConfigPreTokenizerByteLevel;
    add_prefix_space: boolean;
    trim_offsets: boolean;
    use_regex: boolean;
    pattern: RegExp;
    byte_encoder: Record<number, string>;
    text_encoder: TextEncoder;
    /**
     * Creates a new instance of the `ByteLevelPreTokenizer` class.
     * @param config The configuration object.
     */
    constructor(config: TokenizerConfigPreTokenizerByteLevel);
    /**
     * Tokenizes a single piece of text using byte-level tokenization.
     * @param text The text to tokenize.
     * @param options Additional options for the pre-tokenization logic.
     * @returns An array of tokens.
     */
    pre_tokenize_text(text: string, options?: any): string[];
}
export default ByteLevel;
