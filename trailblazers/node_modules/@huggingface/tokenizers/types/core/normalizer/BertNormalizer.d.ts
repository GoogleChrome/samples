import Normalizer from "../Normalizer";
import type { TokenizerConfigNormalizerBert } from "@static/tokenizer";
/**
 * A class representing a normalizer used in BERT tokenization.
 */
declare class BertNormalizer extends Normalizer {
    config: TokenizerConfigNormalizerBert;
    /**
     * Adds whitespace around any CJK (Chinese, Japanese, or Korean) character in the input text.
     *
     * @param text The input text to tokenize.
     * @returns The tokenized text with whitespace added around CJK characters.
     */
    private tokenize_chinese_chars;
    /**
     * Strips accents from the given text.
     * @param text The text to strip accents from.
     * @returns The text with accents removed.
     */
    strip_accents(text: string): string;
    /**
     * Checks whether `char` is a control character.
     * @param char The character to check.
     * @returns Whether `char` is a control character.
     */
    private is_control;
    /**
     * Performs invalid character removal and whitespace cleanup on text.
     * @param text The text to clean.
     * @returns The cleaned text.
     */
    private clean_text;
    /**
     * Normalizes the given text based on the configuration.
     * @param text The text to normalize.
     * @returns The normalized text.
     */
    normalize(text: string): string;
}
export default BertNormalizer;
