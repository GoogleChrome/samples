/**
 * Helper class which is used to instantiate pretrained tokenizers with the `from_pretrained` function.
 * The chosen tokenizer class is determined by the type specified in the tokenizer config.
 *
 * **Example:** Create an `AutoTokenizer` and use it to tokenize a sentence.
 * This will automatically detect the tokenizer type based on the tokenizer class defined in `tokenizer_config.json`.
 *
 * ```javascript
 * import { AutoTokenizer } from '@huggingface/transformers';
 *
 * const tokenizer = await AutoTokenizer.from_pretrained('Xenova/bert-base-uncased');
 * const { input_ids } = await tokenizer('I love transformers!');
 * // Tensor {
 * //   data: BigInt64Array(6) [101n, 1045n, 2293n, 19081n, 999n, 102n],
 * //   dims: [1, 6],
 * //   type: 'int64',
 * //   size: 6,
 * // }
 * ```
 */
export class AutoTokenizer {
    /**
     * Instantiate one of the tokenizer classes of the library from a pretrained model.
     *
     * The tokenizer class to instantiate is selected based on the `tokenizer_class` property of the config object
     * (either passed as an argument or loaded from `pretrained_model_name_or_path` if possible)
     *
     * @param {string} pretrained_model_name_or_path The name or path of the pretrained model. Can be either:
     * - A string, the *model id* of a pretrained tokenizer hosted inside a model repo on huggingface.co.
     *   Valid model ids can be located at the root-level, like `bert-base-uncased`, or namespaced under a
     *   user or organization name, like `dbmdz/bert-base-german-cased`.
     * - A path to a *directory* containing tokenizer files, e.g., `./my_model_directory/`.
     * @param {import('../../tokenization_utils.js').PretrainedTokenizerOptions} options Additional options for loading the tokenizer.
     *
     * @returns {Promise<PreTrainedTokenizer>} A new instance of the PreTrainedTokenizer class.
     */
    static from_pretrained(pretrained_model_name_or_path: string, { progress_callback, config, cache_dir, local_files_only, revision }?: import("../../tokenization_utils.js").PretrainedTokenizerOptions): Promise<PreTrainedTokenizer>;
}
import { PreTrainedTokenizer } from '../../tokenization_utils.js';
//# sourceMappingURL=tokenization_auto.d.ts.map