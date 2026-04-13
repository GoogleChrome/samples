export class EsmPreTrainedModel extends PreTrainedModel {
}
/**
 * The bare ESM Model transformer outputting raw hidden-states without any specific head on top.
 */
export class EsmModel extends EsmPreTrainedModel {
}
/**
 * ESM Model with a `language modeling` head on top.
 */
export class EsmForMaskedLM extends EsmPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
     */
    _call(model_inputs: any): Promise<MaskedLMOutput>;
}
/**
 * ESM Model transformer with a sequence classification/regression head on top (a linear layer on top of the pooled output)
 */
export class EsmForSequenceClassification extends EsmPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
/**
 * ESM Model with a token classification head on top (a linear layer on top of the hidden-states output)
 * e.g. for Named-Entity-Recognition (NER) tasks.
 */
export class EsmForTokenClassification extends EsmPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
     */
    _call(model_inputs: any): Promise<TokenClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { MaskedLMOutput } from '../modeling_outputs.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
import { TokenClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_esm.d.ts.map