/**
 * @todo This model is not yet supported by Hugging Face's "fast" tokenizers library (https://github.com/huggingface/tokenizers).
 * Therefore, this implementation (which is based on fast tokenizers) may produce slightly inaccurate results.
 */
export class MarianTokenizer extends PreTrainedTokenizer {
    languageRegex: RegExp;
    supported_language_codes: string[];
}
import { PreTrainedTokenizer } from '../../tokenization_utils.js';
//# sourceMappingURL=tokenization_marian.d.ts.map