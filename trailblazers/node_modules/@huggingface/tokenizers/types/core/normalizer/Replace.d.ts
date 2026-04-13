import Normalizer from "../Normalizer";
import type { TokenizerConfigNormalizerReplace } from "@static/tokenizer";
/**
 * Replace normalizer that replaces occurrences of a pattern with a given string or regular expression.
 */
declare class Replace extends Normalizer {
    config: TokenizerConfigNormalizerReplace;
    /**
     * Normalize the input text by replacing the pattern with the content.
     * @param text The input text to be normalized.
     * @returns The normalized text after replacing the pattern with the content.
     */
    normalize(text: string): string;
}
export default Replace;
