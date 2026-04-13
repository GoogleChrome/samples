export class MusicgenPreTrainedModel extends PreTrainedModel {
}
/**
 * The bare Musicgen decoder model outputting raw hidden-states without any specific head on top.
 */
export class MusicgenModel extends MusicgenPreTrainedModel {
}
/**
 * The MusicGen decoder model with a language modelling head on top.
 */
export class MusicgenForCausalLM extends MusicgenPreTrainedModel {
}
/**
 * The composite MusicGen model with a text encoder, audio encoder and Musicgen decoder,
 * for music generation tasks with one or both of text and audio prompts.
 *
 * **Example:** Generate music from text with `Xenova/musicgen-small`.
 * ```javascript
 * import { AutoTokenizer, MusicgenForConditionalGeneration, RawAudio } from '@huggingface/transformers';
 *
 * // Load tokenizer and model
 * const tokenizer = await AutoTokenizer.from_pretrained('Xenova/musicgen-small');
 * const model = await MusicgenForConditionalGeneration.from_pretrained(
 *   'Xenova/musicgen-small', { dtype: 'fp32' }
 * );
 *
 * // Prepare text input
 * const prompt = '80s pop track with bassy drums and synth';
 * const inputs = tokenizer(prompt);
 *
 * // Generate audio
 * const audio_values = await model.generate({
 *   ...inputs,
 *   max_new_tokens: 512,
 *   do_sample: true,
 *   guidance_scale: 3,
 * });
 *
 * // (Optional) Save the output to a WAV file
 * const audio = new RawAudio(
 *   audio_values.data,
 *   model.config.audio_encoder.sampling_rate,
 * );
 * audio.save('musicgen_out.wav');
 * ```
 */
export class MusicgenForConditionalGeneration extends PreTrainedModel {
    /**
     * Apply the pattern mask to the final ids,
     * then revert the pattern delay mask by filtering the pad token id in a single step.
     * @param {Tensor} outputs The output tensor from the model.
     * @returns {Tensor} The filtered output tensor.
     */
    _apply_and_filter_by_delay_pattern_mask(outputs: Tensor): Tensor;
    prepare_inputs_for_generation(input_ids: any, model_inputs: any, generation_config: any): any;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=modeling_musicgen.d.ts.map