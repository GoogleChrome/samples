import PreTokenizer from "../PreTokenizer";
/**
 * Splits on word boundaries (using the following regular expression: `\w+|[^\w\s]+`).
 */
declare class Whitespace extends PreTokenizer {
    /**
     * Pre-tokenizes the input text by splitting it on word boundaries.
     * @param text The text to be pre-tokenized.
     * @param options Additional options for the pre-tokenization logic.
     * @returns An array of tokens produced by splitting the input text on whitespace.
     */
    pre_tokenize_text(text: string, options?: any): string[];
}
export default Whitespace;
