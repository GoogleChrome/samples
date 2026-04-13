export class MBartTokenizer extends PreTrainedTokenizer {
    constructor(tokenizerJSON: any, tokenizerConfig: any);
    languageRegex: RegExp;
    language_codes: string[];
    lang_to_token: (x: any) => any;
    /**
     * Helper function to build translation inputs for an `MBartTokenizer`.
     * @param {string|string[]} raw_inputs The text to tokenize.
     * @param {Object} tokenizer_options Options to be sent to the tokenizer
     * @param {Object} generate_kwargs Generation options.
     * @returns {Object} Object to be passed to the model.
     */
    _build_translation_inputs(raw_inputs: string | string[], tokenizer_options: any, generate_kwargs: any): any;
}
import { PreTrainedTokenizer } from '../../tokenization_utils.js';
//# sourceMappingURL=tokenization_mbart.d.ts.map