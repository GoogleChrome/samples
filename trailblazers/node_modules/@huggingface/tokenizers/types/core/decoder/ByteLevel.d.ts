import Decoder from "../Decoder";
import type { TokenizerConfigDecoderByteLevel } from "@static/tokenizer";
/**
 * Byte-level decoder for tokenization output. Inherits from the `Decoder` class.
 */
declare class ByteLevel extends Decoder {
    byte_decoder: Record<string, number>;
    text_decoder: TextDecoder;
    /**
     * Create a `ByteLevelDecoder` object.
     */
    constructor(config: TokenizerConfigDecoderByteLevel);
    /**
     * Convert an array of tokens to string by decoding each byte.
     * @param tokens Array of tokens to be decoded.
     * @returns The decoded string.
     */
    convert_tokens_to_string(tokens: string[]): string;
    decode_chain(tokens: string[]): string[];
}
export default ByteLevel;
