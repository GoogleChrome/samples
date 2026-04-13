import Decoder from "../Decoder";
import { TokenizerConfigDecoderCTC } from "@static/tokenizer";
/**
 * The CTC (Connectionist Temporal Classification) decoder.
 * See https://github.com/huggingface/tokenizers/blob/bb38f390a61883fc2f29d659af696f428d1cda6b/tokenizers/src/decoders/ctc.rs
 */
declare class CTC extends Decoder {
    pad_token: string;
    word_delimiter_token: string;
    cleanup?: boolean;
    constructor(config: TokenizerConfigDecoderCTC);
    /**
     * Converts a connectionist-temporal-classification (CTC) output tokens into a single string.
     * @param tokens Array of tokens to be decoded.
     * @returns The decoded string.
     */
    convert_tokens_to_string(tokens: string[]): string;
    decode_chain(tokens: string[]): string[];
}
export default CTC;
