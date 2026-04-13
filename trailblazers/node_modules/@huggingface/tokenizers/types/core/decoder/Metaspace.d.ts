import Decoder from "../Decoder";
import { TokenizerConfigDecoderMetaspace } from "@static/tokenizer";
/**
 * MetaspaceDecoder class extends the Decoder class and decodes Metaspace tokenization.
 */
declare class Metaspace extends Decoder {
    replacement: string;
    /**
     * Constructs a new MetaspaceDecoder object.
     * @param config The configuration object for the MetaspaceDecoder.
     */
    constructor(config: TokenizerConfigDecoderMetaspace);
    decode_chain(tokens: string[]): string[];
}
export default Metaspace;
