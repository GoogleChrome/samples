import Decoder from "../Decoder";
/**
 * Fuse simply fuses all tokens into one big string.
 * It's usually the last decoding step anyway, but this decoder
 * exists incase some decoders need to happen after that step
 */
declare class Fuse extends Decoder {
    decode_chain(tokens: string[]): string[];
}
export default Fuse;
