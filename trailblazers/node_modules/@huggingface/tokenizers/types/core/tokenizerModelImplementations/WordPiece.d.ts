import TokenizerModel from "../TokenizerModel";
import { TokenizerConfigWordPieceModel } from "@static/tokenizer";
/**
 * A subclass of TokenizerModel that uses WordPiece encoding to encode tokens.
 */
declare class WordPieceTokenizer extends TokenizerModel {
    config: TokenizerConfigWordPieceModel;
    /** The maximum number of characters per word. */
    max_input_chars_per_word: number;
    /**
     * @param config The configuration object.
     */
    constructor(config: TokenizerConfigWordPieceModel);
    /**
     * Encodes an array of tokens using WordPiece encoding.
     * @param tokens The tokens to encode.
     * @returns An array of encoded tokens.
     */
    encode(tokens: string[]): string[];
}
export default WordPieceTokenizer;
