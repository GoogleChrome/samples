import Decoder from "../Decoder";
import { TokenizerConfigDecoderSequence } from "@static/tokenizer";
/**
 * Apply a sequence of decoders.
 */
declare class Sequence extends Decoder {
    decoders: Decoder[];
    /**
     * Creates a new instance of DecoderSequence.
     * @param config The configuration object.
     */
    constructor(config: TokenizerConfigDecoderSequence);
    decode_chain(tokens: string[]): string[];
}
export default Sequence;
