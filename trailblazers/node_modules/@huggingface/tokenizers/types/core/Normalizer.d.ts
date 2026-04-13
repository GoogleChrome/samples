import { Callable } from "@utils";
import type { TokenizerConfigNormalizer } from "@static/tokenizer";
/**
 * A base class for text normalization.
 */
declare abstract class Normalizer extends Callable<[string], string> {
    config: TokenizerConfigNormalizer;
    /**
     * @param config The configuration object for the normalizer.
     */
    constructor(config: TokenizerConfigNormalizer);
    /**
     * Normalize the input text.
     * @param text The text to normalize.
     * @returns The normalized text.
     */
    abstract normalize(text: string): string;
    /**
     * Alias for {@link Normalizer#normalize}.
     * @param text The text to normalize.
     * @returns The normalized text.
     */
    _call(text: string): string;
}
export default Normalizer;
