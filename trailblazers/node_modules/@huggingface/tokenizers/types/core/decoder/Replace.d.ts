import Decoder from "../Decoder";
import { TokenizerConfigDecoderReplace } from "@static/tokenizer";
declare class Replace extends Decoder {
    config: TokenizerConfigDecoderReplace;
    decode_chain(tokens: string[]): string[];
}
export default Replace;
