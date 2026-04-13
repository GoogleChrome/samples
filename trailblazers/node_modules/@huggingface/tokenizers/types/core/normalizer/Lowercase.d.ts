import Normalizer from "../Normalizer";
import type { TokenizerConfigNormalizerLowercase } from "@static/tokenizer";
/**
 * A Normalizer that lowercases the input string.
 */
declare class Lowercase extends Normalizer {
    config: TokenizerConfigNormalizerLowercase;
    /**
     * Lowercases the input string.
     * @param {string} text The text to normalize.
     * @returns {string} The normalized text.
     */
    normalize(text: string): string;
}
export default Lowercase;
