import Normalizer from "../Normalizer";
import type { TokenizerConfigNormalizerPrecompiled } from "@static/tokenizer";
/**
 * A normalizer that applies a precompiled charsmap.
 * This is useful for applying complex normalizations in C++ and exposing them to JavaScript.
 */
declare class Precompiled extends Normalizer {
    charsmap: any;
    /**
     * Create a new instance of Precompiled normalizer.
     * @param config The configuration object.
     */
    constructor(config: TokenizerConfigNormalizerPrecompiled);
    /**
     * Normalizes the given text by applying the precompiled charsmap.
     * @param text The text to normalize.
     * @returns The normalized text.
     */
    normalize(text: string): string;
}
export default Precompiled;
