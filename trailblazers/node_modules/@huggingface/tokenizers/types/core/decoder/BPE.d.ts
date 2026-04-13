import Decoder from "../Decoder";
import type { TokenizerConfigDecoderBPE } from "@static/tokenizer";
declare class BPE extends Decoder {
    suffix: string;
    constructor(config: TokenizerConfigDecoderBPE);
    decode_chain(tokens: string[]): string[];
}
export default BPE;
