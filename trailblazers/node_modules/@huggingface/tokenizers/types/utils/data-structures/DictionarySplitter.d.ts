/**
 * A data structure which uses a trie to split a string into tokens based on a dictionary.
 * It can also use a regular expression to preprocess the input text before splitting.
 *
 * NOTE: To ensure multi-byte characters are handled correctly, we operate at byte-level instead of character-level.
 */
declare class DictionarySplitter {
    private trie;
    /**
     * @param dictionary The dictionary of words to use for splitting.
     */
    constructor(dictionary: string[]);
    /**
     * Builds a trie from the given dictionary.
     * @param dictionary The dictionary of words to build the trie from.
     * @returns The root node of the trie.
     * @private
     */
    private _build_trie;
    /**
     * Splits the input text into tokens based on the dictionary.
     * @param text The input text to split.
     * @returns An array of tokens.
     */
    split(text: string): string[];
}
export default DictionarySplitter;
