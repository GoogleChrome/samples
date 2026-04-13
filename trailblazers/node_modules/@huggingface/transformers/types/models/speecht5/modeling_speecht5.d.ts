/**
 * An abstract class to handle weights initialization and a simple interface for downloading and loading pretrained models.
 */
export class SpeechT5PreTrainedModel extends PreTrainedModel {
}
/**
 * The bare SpeechT5 Encoder-Decoder Model outputting raw hidden-states without any specific pre- or post-nets.
 */
export class SpeechT5Model extends SpeechT5PreTrainedModel {
}
/**
 * SpeechT5 Model with a speech encoder and a text decoder.
 *
 * **Example:** Generate speech from text with `SpeechT5ForSpeechToText`.
 * ```javascript
 * import { AutoTokenizer, AutoProcessor, SpeechT5ForTextToSpeech, SpeechT5HifiGan, Tensor } from '@huggingface/transformers';
 *
 * // Load the tokenizer and processor
 * const tokenizer = await AutoTokenizer.from_pretrained('Xenova/speecht5_tts');
 * const processor = await AutoProcessor.from_pretrained('Xenova/speecht5_tts');
 *
 * // Load the models
 * // NOTE: We use the full-precision versions as they are more accurate
 * const model = await SpeechT5ForTextToSpeech.from_pretrained('Xenova/speecht5_tts', { dtype: 'fp32' });
 * const vocoder = await SpeechT5HifiGan.from_pretrained('Xenova/speecht5_hifigan', { dtype: 'fp32' });
 *
 * // Load speaker embeddings from URL
 * const speaker_embeddings_data = new Float32Array(
 *   await (await fetch('https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin')).arrayBuffer()
 * );
 * const speaker_embeddings = new Tensor(
 *   'float32',
 *   speaker_embeddings_data,
 *   [1, speaker_embeddings_data.length]
 * )
 *
 * // Run tokenization
 * const { input_ids } = tokenizer('Hello, my dog is cute');
 *
 * // Generate waveform
 * const { waveform } = await model.generate_speech(input_ids, speaker_embeddings, { vocoder });
 * console.log(waveform)
 * // Tensor {
 * //   dims: [ 26112 ],
 * //   type: 'float32',
 * //   size: 26112,
 * //   data: Float32Array(26112) [ -0.00043630177970044315, -0.00018082228780258447, ... ],
 * // }
 * ```
 */
export class SpeechT5ForSpeechToText extends SpeechT5PreTrainedModel {
}
/**
 * SpeechT5 Model with a text encoder and a speech decoder.
 */
export class SpeechT5ForTextToSpeech extends SpeechT5PreTrainedModel {
    /**
     * @typedef {Object} SpeechOutput
     * @property {Tensor} [spectrogram] The predicted log-mel spectrogram of shape
     * `(output_sequence_length, config.num_mel_bins)`. Returned when no `vocoder` is provided
     * @property {Tensor} [waveform] The predicted waveform of shape `(num_frames,)`. Returned when a `vocoder` is provided.
     * @property {Tensor} [cross_attentions] The outputs of the decoder's cross-attention layers of shape
     * `(config.decoder_layers, config.decoder_attention_heads, output_sequence_length, input_sequence_length)`. returned when `output_cross_attentions` is `true`.
     */
    /**
     * Converts a sequence of input tokens into a sequence of mel spectrograms, which are subsequently turned into a speech waveform using a vocoder.
     * @param {Tensor} input_values Indices of input sequence tokens in the vocabulary.
     * @param {Tensor} speaker_embeddings Tensor containing the speaker embeddings.
     * @param {Object} options Optional parameters for generating speech.
     * @param {number} [options.threshold=0.5] The generated sequence ends when the predicted stop token probability exceeds this value.
     * @param {number} [options.minlenratio=0.0] Used to calculate the minimum required length for the output sequence.
     * @param {number} [options.maxlenratio=20.0] Used to calculate the maximum allowed length for the output sequence.
     * @param {Object} [options.vocoder=null] The vocoder that converts the mel spectrogram into a speech waveform. If `null`, the output is the mel spectrogram.
     * @param {boolean} [options.output_cross_attentions=false] Whether or not to return the attentions tensors of the decoder's cross-attention layers.
     * @returns {Promise<SpeechOutput>} A promise which resolves to an object containing the spectrogram, waveform, and cross-attention tensors.
     */
    generate_speech(input_values: Tensor, speaker_embeddings: Tensor, { threshold, minlenratio, maxlenratio, vocoder, }?: {
        threshold?: number;
        minlenratio?: number;
        maxlenratio?: number;
        vocoder?: any;
        output_cross_attentions?: boolean;
    }): Promise<{
        /**
         * The predicted log-mel spectrogram of shape
         * `(output_sequence_length, config.num_mel_bins)`. Returned when no `vocoder` is provided
         */
        spectrogram?: Tensor;
        /**
         * The predicted waveform of shape `(num_frames,)`. Returned when a `vocoder` is provided.
         */
        waveform?: Tensor;
        /**
         * The outputs of the decoder's cross-attention layers of shape
         * `(config.decoder_layers, config.decoder_attention_heads, output_sequence_length, input_sequence_length)`. returned when `output_cross_attentions` is `true`.
         */
        cross_attentions?: Tensor;
    }>;
}
/**
 * HiFi-GAN vocoder.
 *
 * See [SpeechT5ForSpeechToText](./models#module_models.SpeechT5ForSpeechToText) for example usage.
 */
export class SpeechT5HifiGan extends PreTrainedModel {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=modeling_speecht5.d.ts.map