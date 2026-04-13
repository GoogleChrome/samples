export class DistilBertPreTrainedModel extends PreTrainedModel {
}
export class DistilBertModel extends DistilBertPreTrainedModel {
}
/**
 * DistilBertForSequenceClassification is a class representing a DistilBERT model for sequence classification.
 */
export class DistilBertForSequenceClassification extends DistilBertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
/**
 * DistilBertForTokenClassification is a class representing a DistilBERT model for token classification.
 */
export class DistilBertForTokenClassification extends DistilBertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
     */
    _call(model_inputs: any): Promise<TokenClassifierOutput>;
}
/**
 * DistilBertForQuestionAnswering is a class representing a DistilBERT model for question answering.
 */
export class DistilBertForQuestionAnswering extends DistilBertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
     */
    _call(model_inputs: any): Promise<QuestionAnsweringModelOutput>;
}
/**
 * DistilBertForMaskedLM is a class representing a DistilBERT model for masking task.
 */
export class DistilBertForMaskedLM extends DistilBertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<MaskedLMOutput>} returned object
     */
    _call(model_inputs: any): Promise<MaskedLMOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
import { TokenClassifierOutput } from '../modeling_outputs.js';
import { QuestionAnsweringModelOutput } from '../modeling_outputs.js';
import { MaskedLMOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_distilbert.d.ts.map