import Normalizer from "../Normalizer";
import type { TokenizerConfigNormalizerStripAccents } from "@static/tokenizer";
/**
 * StripAccents normalizer removes all accents from the text.
 */
declare class StripAccents extends Normalizer {
    config: TokenizerConfigNormalizerStripAccents;
    /**
     * Remove all accents from the text.
     * @param text The input text.
     * @returns The normalized text without accents.
     */
    normalize(text: string): string;
}
export default StripAccents;
