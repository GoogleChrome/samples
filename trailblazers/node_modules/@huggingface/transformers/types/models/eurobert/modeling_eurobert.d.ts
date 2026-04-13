export class EuroBertPreTrainedModel extends PreTrainedModel {
}
export class EuroBertModel extends EuroBertPreTrainedModel {
}
export class EuroBertForMaskedLM extends EuroBertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
     */
    _call(model_inputs: any): Promise<MaskedLMOutput>;
}
export class EuroBertForSequenceClassification extends EuroBertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
export class EuroBertForTokenClassification extends EuroBertPreTrainedModel {
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
//# sourceMappingURL=modeling_eurobert.d.ts.map