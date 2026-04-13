import PreTokenizer from "../PreTokenizer";
/**
 * Splits a string of text by whitespace characters into individual tokens.
 */
declare class WhitespaceSplit extends PreTokenizer {
    /**
     * Pre-tokenizes the input text by splitting it on whitespace characters.
     * @param text The text to be pre-tokenized.
     * @returns An array of tokens produced by splitting the input text on whitespace.
     */
    pre_tokenize_text(text: string): string[];
}
export default WhitespaceSplit;
