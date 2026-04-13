import PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizerReplace } from "@static/tokenizer";
declare class Replace extends PreTokenizer {
    config: TokenizerConfigPreTokenizerReplace;
    pattern: RegExp | null;
    content: string;
    /**
     * @param config The configuration options for the pre-tokenizer.
     */
    constructor(config: TokenizerConfigPreTokenizerReplace);
    /**
     * Pre-tokenizes the input text by replacing certain characters.
     * @param text The text to be pre-tokenized.
     * @returns An array of tokens produced by replacing certain characters.
     */
    pre_tokenize_text(text: string): string[];
}
export default Replace;
