import Decoder from "../Decoder";
import type { TokenizerConfigDecoderByteFallback } from "@static/tokenizer";
declare class ByteFallback extends Decoder {
    text_decoder: TextDecoder;
    constructor(config: TokenizerConfigDecoderByteFallback);
    decode_chain(tokens: string[]): string[];
}
export default ByteFallback;
