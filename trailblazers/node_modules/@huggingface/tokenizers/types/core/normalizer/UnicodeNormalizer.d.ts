import Normalizer from "../Normalizer";
/**
 * A normalizer that applies Unicode normalization to the input text.
 */
declare abstract class UnicodeNormalizer extends Normalizer {
    /**
     * The Unicode normalization form to apply.
     * Should be one of: 'NFC', 'NFD', 'NFKC', or 'NFKD'.
     */
    form: "NFC" | "NFD" | "NFKC" | "NFKD";
    /**
     * Normalize the input text by applying Unicode normalization.
     * @param text The input text to be normalized.
     * @returns The normalized text.
     */
    normalize(text: string): string;
}
export default UnicodeNormalizer;
