export class DacEncoderOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.audio_codes Discrete code embeddings, of shape `(batch_size, num_quantizers, codes_length)`.
     */
    constructor({ audio_codes }: {
        audio_codes: Tensor;
    });
    audio_codes: Tensor;
}
export class DacDecoderOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.audio_values Decoded audio values, of shape `(batch_size, num_channels, sequence_length)`.
     */
    constructor({ audio_values }: {
        audio_values: Tensor;
    });
    audio_values: Tensor;
}
export class DacPreTrainedModel extends PreTrainedModel {
}
/**
 * The DAC (Descript Audio Codec) model.
 */
export class DacModel extends DacPreTrainedModel {
    /**
     * Encodes the input audio waveform into discrete codes.
     * @param {Object} inputs Model inputs
     * @param {Tensor} [inputs.input_values] Float values of the input audio waveform, of shape `(batch_size, channels, sequence_length)`).
     * @returns {Promise<DacEncoderOutput>} The output tensor of shape `(batch_size, num_codebooks, sequence_length)`.
     */
    encode(inputs: {
        input_values?: Tensor;
    }): Promise<DacEncoderOutput>;
    /**
     * Decodes the given frames into an output audio waveform.
     * @param {DacEncoderOutput} inputs The encoded audio codes.
     * @returns {Promise<DacDecoderOutput>} The output tensor of shape `(batch_size, num_channels, sequence_length)`.
     */
    decode(inputs: DacEncoderOutput): Promise<DacDecoderOutput>;
}
export class DacEncoderModel extends DacPreTrainedModel {
}
export class DacDecoderModel extends DacPreTrainedModel {
}
import { ModelOutput } from '../modeling_outputs.js';
import { Tensor } from '../../utils/tensor.js';
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_dac.d.ts.map