export class SnacPreTrainedModel extends PreTrainedModel {
}
/**
 * The SNAC (Multi-Scale Neural Audio Codec) model.
 */
export class SnacModel extends SnacPreTrainedModel {
    /**
     * Encodes the input audio waveform into discrete codes.
     * @param {Object} inputs Model inputs
     * @param {Tensor} [inputs.input_values] Float values of the input audio waveform, of shape `(batch_size, channels, sequence_length)`).
     * @returns {Promise<Record<string, Tensor>>} The output tensors of shape `(batch_size, num_codebooks, sequence_length)`.
     */
    encode(inputs: {
        input_values?: Tensor;
    }): Promise<Record<string, Tensor>>;
    /**
     * Decodes the given frames into an output audio waveform.
     * @param {Record<string, Tensor>} inputs The encoded audio codes.
     * @returns {Promise<{audio_values: Tensor}>} The output tensor of shape `(batch_size, num_channels, sequence_length)`.
     */
    decode(inputs: Record<string, Tensor>): Promise<{
        audio_values: Tensor;
    }>;
}
export class SnacEncoderModel extends SnacPreTrainedModel {
}
export class SnacDecoderModel extends SnacPreTrainedModel {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=modeling_snac.d.ts.map