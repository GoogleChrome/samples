import Decoder from "../Decoder";
import { TokenizerConfigDecoderStrip } from "@static/tokenizer";
declare class Strip extends Decoder {
    content: string;
    start: number;
    stop: number;
    constructor(config: TokenizerConfigDecoderStrip);
    decode_chain(tokens: string[]): string[];
}
export default Strip;
