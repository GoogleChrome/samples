import PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizerSequence } from "@static/tokenizer";
/**
 * A pre-tokenizer that applies a sequence of pre-tokenizers to the input text.
 */
declare class Sequence extends PreTokenizer {
    tokenizers: (PreTokenizer | null)[];
    /**
     * Creates an instance of PreTokenizerSequence.
     * @param config The configuration object for the pre-tokenizer sequence.
     */
    constructor(config: TokenizerConfigPreTokenizerSequence);
    /**
     * Applies each pre-tokenizer in the sequence to the input text in turn.
     * @param text The text to pre-tokenize.
     * @param options Additional options for the pre-tokenization logic.
     * @returns The pre-tokenized text.
     */
    pre_tokenize_text(text: string, options?: any): string[];
}
export default Sequence;
