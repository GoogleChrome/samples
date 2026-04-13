import TokenizerModel from "../TokenizerModel";
import type { TokenizerModelConfigLegacy } from "@static/tokenizer";
/**
 * Legacy tokenizer class for tokenizers with only a vocabulary.
 */
declare class Legacy extends TokenizerModel {
    bos_token: string;
    bos_token_id?: number;
    eos_token: string;
    eos_token_id?: number;
    pad_token: string;
    pad_token_id?: number;
    /**
     * Create a Legacy tokenizer model instance.
     * @param config The configuration object for Legacy tokenizer model.
     * @param more_config Additional configuration object for the Legacy tokenizer model.
     */
    constructor(config: TokenizerModelConfigLegacy, more_config: {
        target_lang: string;
        bos_token: string;
        eos_token: string;
        pad_token: string;
        unk_token: string;
    });
    encode(tokens: string[]): string[];
}
export default Legacy;
