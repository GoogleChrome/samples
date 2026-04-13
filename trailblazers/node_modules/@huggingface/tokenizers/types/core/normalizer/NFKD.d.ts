import UnicodeNormalizer from "./UnicodeNormalizer";
/**
 * A normalizer that applies Unicode normalization form KD (NFKD) to the input text.
 * Compatibility Decomposition.
 */
declare class NFKD extends UnicodeNormalizer {
    form: "NFKD";
}
export default NFKD;
