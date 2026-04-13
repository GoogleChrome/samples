import Decoder from "../Decoder";
import { TokenizerConfigDecoderWordPiece } from "@static/tokenizer";
/**
 * A decoder that decodes a list of WordPiece tokens into a single string.
 */
declare class WordPiece extends Decoder {
    config: TokenizerConfigDecoderWordPiece;
    cleanup?: boolean;
    /**
     * Creates a new instance of WordPieceDecoder.
     * @param config The configuration object.
     */
    constructor(config: TokenizerConfigDecoderWordPiece);
    decode_chain(tokens: string[]): string[];
}
export default WordPiece;
