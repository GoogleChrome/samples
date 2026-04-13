import UnicodeNormalizer from "./UnicodeNormalizer";
/**
 * A normalizer that applies Unicode normalization form C (NFC) to the input text.
 * Canonical Decomposition, followed by Canonical Composition.
 */
declare class NFC extends UnicodeNormalizer {
    form: "NFC";
}
export default NFC;
