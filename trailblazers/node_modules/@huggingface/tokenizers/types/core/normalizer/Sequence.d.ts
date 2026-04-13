import Normalizer from "../Normalizer";
import type { TokenizerConfigNormalizerSequence } from "@static/tokenizer";
/**
 * A Normalizer that applies a sequence of Normalizers.
 */
declare class Sequence extends Normalizer {
    normalizers: (Normalizer | null)[];
    /**
     * Create a new instance of NormalizerSequence.
     * @param config The configuration object.
     */
    constructor(config: TokenizerConfigNormalizerSequence);
    /**
     * Apply a sequence of Normalizers to the input text.
     * @param text The text to normalize.
     * @returns The normalized text.
     */
    normalize(text: string): string;
}
export default Sequence;
