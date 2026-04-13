import { Callable } from "@utils";
import type { PreTokenizeTextOptions } from "@static/tokenizer";
/**
 * A callable class representing a pre-tokenizer used in tokenization. Subclasses
 * should implement the `pre_tokenize_text` method to define the specific pre-tokenization logic.
 */
declare abstract class PreTokenizer extends Callable<[
    string | string[],
    any?
], string[]> {
    /**
     * Method that should be implemented by subclasses to define the specific pre-tokenization logic.
     *
     * @param text The text to pre-tokenize.
     * @param options Additional options for the pre-tokenization logic.
     * @returns The pre-tokenized text.
     */
    abstract pre_tokenize_text(text: string, options?: PreTokenizeTextOptions): string[];
    /**
     * Tokenizes the given text into pre-tokens.
     * @param text The text or array of texts to pre-tokenize.
     * @param options Additional options for the pre-tokenization logic.
     * @returns An array of pre-tokens.
     */
    pre_tokenize(text: string | string[], options?: PreTokenizeTextOptions): string[];
    /**
     * Alias for {@link PreTokenizer#pre_tokenize}.
     * @param text The text or array of texts to pre-tokenize.
     * @param options Additional options for the pre-tokenization logic.
     * @returns An array of pre-tokens.
     */
    _call(text: string | string[], options?: any): string[];
}
export default PreTokenizer;
