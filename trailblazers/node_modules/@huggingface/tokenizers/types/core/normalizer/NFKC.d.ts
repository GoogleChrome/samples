import UnicodeNormalizer from "./UnicodeNormalizer";
/**
 * A normalizer that applies Unicode normalization form KC (NFKC) to the input text.
 * Compatibility Decomposition, followed by Canonical Composition.
 */
declare class NFKC extends UnicodeNormalizer {
    form: "NFKC";
}
export default NFKC;
