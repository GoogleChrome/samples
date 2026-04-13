export class UniSpeechPreTrainedModel extends PreTrainedModel {
}
/**
 * The bare UniSpeech Model transformer outputting raw hidden-states without any specific head on top.
 */
export class UniSpeechModel extends UniSpeechPreTrainedModel {
}
/**
 * UniSpeech Model with a `language modeling` head on top for Connectionist Temporal Classification (CTC).
 */
export class UniSpeechForCTC extends UniSpeechPreTrainedModel {
    /**
     * @param {Object} model_inputs
     * @param {Tensor} model_inputs.input_values Float values of input raw speech waveform.
     * @param {Tensor} model_inputs.attention_mask Mask to avoid performing convolution and attention on padding token indices. Mask values selected in [0, 1]
     */
    _call(model_inputs: {
        input_values: Tensor;
        attention_mask: Tensor;
    }): Promise<CausalLMOutput>;
}
/**
 * UniSpeech Model with a sequence classification head on top (a linear layer over the pooled output).
 */
export class UniSpeechForSequenceClassification extends UniSpeechPreTrainedModel {
    /**
     * Calls the model on new inputs.
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { Tensor } from '../../utils/tensor.js';
import { CausalLMOutput } from '../modeling_outputs.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_unispeech.d.ts.map