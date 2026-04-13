import PreTokenizer from "../PreTokenizer";
/**
 * A PreTokenizer that splits text into wordpieces using a basic tokenization scheme
 * similar to that used in the original implementation of BERT.
 */
declare class BertPreTokenizer extends PreTokenizer {
    pattern: RegExp;
    /**
     * A PreTokenizer that splits text into wordpieces using a basic tokenization scheme
     * similar to that used in the original implementation of BERT.
     */
    constructor();
    /**
     * Tokenizes a single text using the BERT pre-tokenization scheme.
     *
     * @param text The text to tokenize.
     * @param options Additional options for the pre-tokenization logic.
     * @returns An array of tokens.
     */
    pre_tokenize_text(text: string, options?: any): string[];
}
export default BertPreTokenizer;
