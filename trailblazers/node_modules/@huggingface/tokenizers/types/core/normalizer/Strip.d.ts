import Normalizer from "../Normalizer";
import type { TokenizerConfigNormalizerStrip } from "@static/tokenizer";
/**
 * A normalizer that strips leading and/or trailing whitespace from the input text.
 */
declare class Strip extends Normalizer {
    config: TokenizerConfigNormalizerStrip;
    /**
     * Strip leading and/or trailing whitespace from the input text.
     * @param text The input text.
     * @returns The normalized text.
     */
    normalize(text: string): string;
}
export default Strip;
