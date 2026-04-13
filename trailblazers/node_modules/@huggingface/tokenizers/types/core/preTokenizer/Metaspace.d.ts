import PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizerMetaspace, PrependScheme, PreTokenizeTextOptions } from "@static/tokenizer";
/**
 * This PreTokenizer replaces spaces with the given replacement character, adds a prefix space if requested,
 * and returns a list of tokens.
 */
declare class Metaspace extends PreTokenizer {
    /** The character to replace spaces with. */
    replacement: string;
    /** An optional string representation of the replacement character. */
    str_rep: string;
    /** The metaspace prepending scheme. */
    prepend_scheme: PrependScheme;
    /**
     * @param config The configuration object for the MetaspacePreTokenizer.
     */
    constructor(config: TokenizerConfigPreTokenizerMetaspace);
    /**
     * This method takes a string, replaces spaces with the replacement character,
     * adds a prefix space if requested, and returns a new list of tokens.
     * @param text The text to pre-tokenize.
     * @param options The options for the pre-tokenization.
     * @returns A new list of pre-tokenized tokens.
     */
    pre_tokenize_text(text: string, options?: PreTokenizeTextOptions): string[];
}
export default Metaspace;
