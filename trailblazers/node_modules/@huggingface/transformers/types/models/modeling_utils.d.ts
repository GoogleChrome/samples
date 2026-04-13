/**
 * Register task mappings (called by registry.js after defining full mappings)
 * @param {Object} mappings - Object with mapping names as keys
 */
export function registerTaskMappings(mappings: any): void;
/**
 * Creates a boolean tensor with a single value.
 * @param {boolean} value The value of the tensor.
 * @returns {Tensor} The boolean tensor.
 * @private
 */
export function boolTensor(value: boolean): Tensor;
/**
 * Perform forward pass on the seq2seq model (both encoder and decoder).
 * @param {Object} self The seq2seq model object.
 * @param {Object} model_inputs The input object for the model containing encoder and decoder inputs.
 * @returns {Promise<Seq2SeqLMOutput>} Promise that resolves with the output of the seq2seq model.
 * @private
 */
export function seq2seq_forward(self: any, model_inputs: any): Promise<Seq2SeqLMOutput>;
/**
 * Forward pass of an encoder model.
 * @param {Object} self The encoder model.
 * @param {Object} model_inputs The input data to be used for the forward pass.
 * @returns {Promise<Object>} The model's outputs.
 * @private
 */
export function encoder_forward(self: any, model_inputs: any): Promise<any>;
export function auto_encoder_forward(self: any, model_inputs: any): Promise<any>;
/**
 * Forward pass of a decoder model.
 * @param {Object} self The decoder model.
 * @param {Object} model_inputs The input data to be used for the forward pass.
 * @returns {Promise<Object>} The logits and past key values.
 * @private
 */
export function decoder_forward(self: any, model_inputs: any, is_encoder_decoder?: boolean): Promise<any>;
/**
 * Abstract forward pass function for image-text-to-text or audio-text-to-text models.
 * @param {Object} self The model object.
 * @param {Object} params Additional parameters.
 * @param {Function} [params.encode_function] The function to encode the modality values.
 * @param {Function} [params.merge_function] The function to merge the modality features with the input embeddings.
 * @param {string[]} [params.modality_input_names] The modality input name.
 * @param {string} [params.modality_output_name] The modality output name.
 * @param {Tensor} [params.input_ids=null]
 * @param {Tensor} [params.attention_mask=null]
 * @param {Tensor} [params.position_ids=null]
 * @param {Tensor} [params.inputs_embeds=null]
 * @param {DynamicCache} [params.past_key_values=null]
 * @param {Object} [params.generation_config=null]
 * @param {Object} [params.logits_processor=null]
 * @returns {Promise<Tensor>} The model's output tensor
 * @private
 */
export function generic_text_to_text_forward(self: any, { encode_function, merge_function, modality_input_names, modality_output_name, input_ids, attention_mask, position_ids, inputs_embeds, past_key_values, generation_config, logits_processor, ...kwargs }: {
    encode_function?: Function;
    merge_function?: Function;
    modality_input_names?: string[];
    modality_output_name?: string;
    input_ids?: Tensor;
    attention_mask?: Tensor;
    position_ids?: Tensor;
    inputs_embeds?: Tensor;
    past_key_values?: DynamicCache;
    generation_config?: any;
    logits_processor?: any;
}): Promise<Tensor>;
/**
 * Forward pass of an audio-text-to-text model.
 * @param {Object} self The audio-text-to-text model.
 * @param {Object} params The inputs for the audio-text-to-text forward pass.
 * @returns {Promise<Tensor>} The model's output tensor.
 * @private
 */
export function audio_text_to_text_forward(self: any, params: any): Promise<Tensor>;
/**
 * Forward pass of an image-text-to-text model.
 * @param {Object} self The image-text-to-text model.
 * @param {Object} params The inputs for the image-text-to-text forward pass.
 * @returns {Promise<Tensor>} The model's output tensor.
 * @private
 */
export function image_text_to_text_forward(self: any, params: any): Promise<Tensor>;
/**
 * Helper function to perform the following:
 * ```python
 * x = attention_mask.long().cumsum(-1) - 1
 * x.masked_fill_(attention_mask == 0, 1)
 * ```
 * @param {Tensor} attention_mask
 * @returns {{data: BigInt64Array, dims: number[]}}
 */
export function cumsum_masked_fill(attention_mask: Tensor, start_index?: number): {
    data: BigInt64Array;
    dims: number[];
};
/**
 * If the model supports providing position_ids, we create position_ids on the fly for batch generation,
 * by computing the cumulative sum of the attention mask along the sequence length dimension.
 *
 * Equivalent to:
 * ```python
 * position_ids = attention_mask.long().cumsum(-1) - 1
 * position_ids.masked_fill_(attention_mask == 0, 1)
 * if past_key_values:
 *     position_ids = position_ids[:, -input_ids.shape[1] :]
 * ```
 */
export function create_position_ids(model_inputs: any, past_key_values?: any, start_index?: number): Tensor;
export function decoder_prepare_inputs_for_generation(self: any, input_ids: any, model_inputs: any, generation_config: any): any;
export function encoder_decoder_prepare_inputs_for_generation(self: any, input_ids: any, model_inputs: any, generation_config: any): any;
export function multimodal_text_to_text_prepare_inputs_for_generation(self: any, ...args: any[]): any;
export function default_merge_input_ids_with_features({ modality_token_id, inputs_embeds, modality_features, input_ids, attention_mask, }: {
    modality_token_id: any;
    inputs_embeds: any;
    modality_features: any;
    input_ids: any;
    attention_mask: any;
}): {
    inputs_embeds: any;
    attention_mask: any;
};
export function default_merge_input_ids_with_image_features({ image_token_id, inputs_embeds, image_features, input_ids, attention_mask, }: {
    image_token_id: any;
    inputs_embeds: any;
    image_features: any;
    input_ids: any;
    attention_mask: any;
}): {
    inputs_embeds: any;
    attention_mask: any;
};
export function default_merge_input_ids_with_audio_features({ audio_token_id, inputs_embeds, audio_features, input_ids, attention_mask, }: {
    audio_token_id: any;
    inputs_embeds: any;
    audio_features: any;
    input_ids: any;
    attention_mask: any;
}): {
    inputs_embeds: any;
    attention_mask: any;
};
/**
 * Helper function to load multiple optional configuration files
 * @param {string} pretrained_model_name_or_path The path to the directory containing the config file.
 * @param {Record<string, string>} names The names of the config files to load.
 * @param {import('../utils/hub.js').PretrainedModelOptions} options Additional options for loading the configs.
 * @returns {Promise<Record<string, any>>} A Promise that resolves to a dictionary of configuration objects.
 * @private
 */
export function get_optional_configs(pretrained_model_name_or_path: string, names: Record<string, string>, options: import("../utils/hub.js").PretrainedModelOptions): Promise<Record<string, any>>;
export let MODEL_MAPPING_NAMES: any;
export const MODEL_TYPE_MAPPING: Map<any, any>;
export const MODEL_NAME_TO_CLASS_MAPPING: Map<any, any>;
export const MODEL_CLASS_TO_NAME_MAPPING: Map<any, any>;
declare const PreTrainedModel_base: new () => {
    (...args: any[]): any;
    _call(...args: any[]): any;
};
/**
 * A base class for pre-trained models that provides the model configuration and an ONNX session.
 */
export class PreTrainedModel extends PreTrainedModel_base {
    /**
     * Instantiate one of the model classes of the library from a pretrained model.
     *
     * The model class to instantiate is selected based on the `model_type` property of the config object
     * (either passed as an argument or loaded from `pretrained_model_name_or_path` if possible)
     *
     * @param {string} pretrained_model_name_or_path The name or path of the pretrained model. Can be either:
     * - A string, the *model id* of a pretrained model hosted inside a model repo on huggingface.co.
     *   Valid model ids can be located at the root-level, like `bert-base-uncased`, or namespaced under a
     *   user or organization name, like `dbmdz/bert-base-german-cased`.
     * - A path to a *directory* containing model weights, e.g., `./my_model_directory/`.
     * @param {import('../utils/hub.js').PretrainedModelOptions} options Additional options for loading the model.
     *
     * @returns {Promise<PreTrainedModel>} A new instance of the `PreTrainedModel` class.
     */
    static from_pretrained(pretrained_model_name_or_path: string, { progress_callback, config, cache_dir, local_files_only, revision, model_file_name, subfolder, device, dtype, use_external_data_format, session_options, }?: import("../utils/hub.js").PretrainedModelOptions): Promise<PreTrainedModel>;
    /**
     * Creates a new instance of the `PreTrainedModel` class.
     * @param {import('../configs.js').PretrainedConfig} config The model configuration.
     * @param {Record<string, any>} sessions The inference sessions for the model.
     * @param {Record<string, Object>} configs Additional configuration files (e.g., generation_config.json).
     */
    constructor(config: import("../configs.js").PretrainedConfig, sessions: Record<string, any>, configs: Record<string, any>);
    main_input_name: string;
    forward_params: string[];
    _return_dict_in_generate_keys: any;
    config: import("../configs.js").PretrainedConfig;
    sessions: Record<string, any>;
    configs: Record<string, any>;
    can_generate: any;
    _forward: any;
    _prepare_inputs_for_generation: any;
    /** @type {import('../configs.js').TransformersJSConfig} */
    custom_config: import("../configs.js").TransformersJSConfig;
    /**
     * Disposes of all the ONNX sessions that were created during inference.
     * @returns {Promise<unknown[]>} An array of promises, one for each ONNX session that is being disposed.
     * @todo Use https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
     */
    dispose(): Promise<unknown[]>;
    /**
     * Runs the model with the provided inputs
     * @param {Object} model_inputs Object containing input tensors
     * @returns {Promise<Object>} Object containing output tensors
     */
    _call(model_inputs: any): Promise<any>;
    /**
     * Forward method for a pretrained model. If not overridden by a subclass, the correct forward method
     * will be chosen based on the model type.
     * @param {Object} model_inputs The input data to the model in the format specified in the ONNX model.
     * @returns {Promise<Object>} The output data from the model in the format specified in the ONNX model.
     * @throws {Error} This method must be implemented in subclasses.
     */
    forward(model_inputs: any): Promise<any>;
    /**
     * Get the model's generation config, if it exists.
     * @returns {GenerationConfig|null} The model's generation config if it exists, otherwise `null`.
     */
    get generation_config(): GenerationConfig | null;
    /**
     * @param {GenerationConfig} generation_config
     * @param {number} input_ids_seq_length The starting sequence length for the input ids.
     * @returns {LogitsProcessorList}
     * @private
     */
    private _get_logits_processor;
    /**
     * This function merges multiple generation configs together to form a final generation config to be used by the model for text generation.
     * It first creates an empty `GenerationConfig` object, then it applies the model's own `generation_config` property to it. Finally, if a `generation_config` object was passed in the arguments, it overwrites the corresponding properties in the final config with those of the passed config object.
     * @param {GenerationConfig|null} generation_config A `GenerationConfig` object containing generation parameters.
     * @param {Object} kwargs Additional generation parameters to be used in place of those in the `generation_config` object.
     * @returns {GenerationConfig} The final generation config object to be used by the model for text generation.
     */
    _prepare_generation_config(generation_config: GenerationConfig | null, kwargs: any, cls?: typeof GenerationConfig): GenerationConfig;
    /**
     *
     * @param {GenerationConfig} generation_config
     * @param {import('../generation/stopping_criteria.js').StoppingCriteria|import('../generation/stopping_criteria.js').StoppingCriteria[]|StoppingCriteriaList} [stopping_criteria=null]
     */
    _get_stopping_criteria(generation_config: GenerationConfig, stopping_criteria?: import("../generation/stopping_criteria.js").StoppingCriteria | import("../generation/stopping_criteria.js").StoppingCriteria[] | StoppingCriteriaList): StoppingCriteriaList;
    /**
     * Confirms that the model class is compatible with generation.
     * If not, raises an exception that points to the right class to use.
     */
    _validate_model_class(): void;
    prepare_inputs_for_generation(...args: any[]): any;
    /**
     *
     * @param {Object} inputs
     * @param {bigint[][]} inputs.generated_input_ids
     * @param {Object} inputs.outputs
     * @param {Object} inputs.model_inputs
     * @param {boolean} inputs.is_encoder_decoder
     * @returns {Object} The updated model inputs for the next generation iteration.
     */
    _update_model_kwargs_for_generation({ generated_input_ids, outputs, model_inputs, is_encoder_decoder }: {
        generated_input_ids: bigint[][];
        outputs: any;
        model_inputs: any;
        is_encoder_decoder: boolean;
    }): any;
    /**
     * This function extracts the model-specific `inputs` for generation.
     * @param {Object} params
     * @param {Tensor} [params.inputs=null]
     * @param {number} [params.bos_token_id=null]
     * @param {Record<string, Tensor|number[]>} [params.model_kwargs]
     * @returns {{inputs_tensor: Tensor, model_inputs: Record<string, Tensor> & {past_key_values?: DynamicCache}, model_input_name: string}} The model-specific inputs for generation.
     */
    _prepare_model_inputs({ inputs, bos_token_id, model_kwargs }: {
        inputs?: Tensor;
        bos_token_id?: number;
        model_kwargs?: Record<string, Tensor | number[]>;
    }): {
        inputs_tensor: Tensor;
        model_inputs: Record<string, Tensor> & {
            past_key_values?: DynamicCache;
        };
        model_input_name: string;
    };
    _prepare_encoder_decoder_kwargs_for_generation({ inputs_tensor, model_inputs, model_input_name, generation_config, }: {
        inputs_tensor: any;
        model_inputs: any;
        model_input_name: any;
        generation_config: any;
    }): Promise<any>;
    /**
     * Prepares `decoder_input_ids` for generation with encoder-decoder models
     * @param {*} param0
     */
    _prepare_decoder_input_ids_for_generation({ batch_size, model_input_name, model_kwargs, decoder_start_token_id, bos_token_id, generation_config, }: any): {
        input_ids: any;
        model_inputs: any;
    };
    /**
     * Generates sequences of token ids for models with a language modeling head.
     * @param {import('../generation/parameters.js').GenerationFunctionParameters} options
     * @returns {Promise<ModelOutput|Tensor>} The output of the model, which can contain the generated token ids, attentions, and scores.
     */
    generate({ inputs, generation_config, logits_processor, stopping_criteria, streamer, ...kwargs }: import("../generation/parameters.js").GenerationFunctionParameters): Promise<ModelOutput | Tensor>;
    /**
     * Returns a DynamicCache containing past key values from the given decoder results object.
     *
     * @param {Object} decoderResults The decoder results object.
     * @param {DynamicCache} pastKeyValues The previous past key values.
     * @param {boolean} [disposeEncoderPKVs=false] Whether to dispose encoder past key values.
     * @returns {DynamicCache} A new DynamicCache containing the updated past key values.
     */
    getPastKeyValues(decoderResults: any, pastKeyValues: DynamicCache, disposeEncoderPKVs?: boolean): DynamicCache;
    /**
     * Returns an object containing attentions from the given model output object.
     *
     * @param {Object} model_output The output of the model.
     * @returns {{cross_attentions?: Tensor[]}} An object containing attentions.
     */
    getAttentions(model_output: any): {
        cross_attentions?: Tensor[];
    };
    /**
     * Adds past key values to the decoder feeds object. If pastKeyValues is null, creates new tensors for past key values.
     *
     * @param {Record<string, any>} decoderFeeds The decoder feeds object to add past key values to.
     * @param {DynamicCache|null} pastKeyValues The cache containing past key values.
     */
    addPastKeyValues(decoderFeeds: Record<string, any>, pastKeyValues: DynamicCache | null): void;
    /**
     * Helper function to select valid inputs and run through the appropriate encoder (vision, text, audio) based on the input type.
     * @param {string} sessionName
     * @param {Record<string, Tensor>} inputs
     * @param {string} outputName
     * @private
     */
    private _encode_input;
    encode_image(inputs: any): Promise<any>;
    encode_text(inputs: any): Promise<any>;
    encode_audio(inputs: any): Promise<any>;
}
import { Tensor } from '../utils/tensor.js';
import { Seq2SeqLMOutput } from './modeling_outputs.js';
import { DynamicCache } from '../cache_utils.js';
import { GenerationConfig } from '../generation/configuration_utils.js';
import { StoppingCriteriaList } from '../generation/stopping_criteria.js';
import { ModelOutput } from './modeling_outputs.js';
export { getSessionsConfig, getTextOnlySessions, MODEL_TYPES } from "./session_config.js";
//# sourceMappingURL=modeling_utils.d.ts.map