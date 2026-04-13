export class XLMRobertaPreTrainedModel extends PreTrainedModel {
}
export class XLMRobertaModel extends XLMRobertaPreTrainedModel {
}
/**
 * XLMRobertaForMaskedLM class for performing masked language modeling on XLMRoberta models.
 */
export class XLMRobertaForMaskedLM extends XLMRobertaPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<MaskedLMOutput>} returned object
     */
    _call(model_inputs: any): Promise<MaskedLMOutput>;
}
/**
 * XLMRobertaForSequenceClassification class for performing sequence classification on XLMRoberta models.
 */
export class XLMRobertaForSequenceClassification extends XLMRobertaPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} returned object
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
/**
 * XLMRobertaForTokenClassification class for performing token classification on XLMRoberta models.
 */
export class XLMRobertaForTokenClassification extends XLMRobertaPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
     */
    _call(model_inputs: any): Promise<TokenClassifierOutput>;
}
/**
 * XLMRobertaForQuestionAnswering class for performing question answering on XLMRoberta models.
 */
export class XLMRobertaForQuestionAnswering extends XLMRobertaPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<QuestionAnsweringModelOutput>} returned object
     */
    _call(model_inputs: any): Promise<QuestionAnsweringModelOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { MaskedLMOutput } from '../modeling_outputs.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
import { TokenClassifierOutput } from '../modeling_outputs.js';
import { QuestionAnsweringModelOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_xlm_roberta.d.ts.map