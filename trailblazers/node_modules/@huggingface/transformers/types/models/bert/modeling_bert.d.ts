export class BertPreTrainedModel extends PreTrainedModel {
}
export class BertModel extends BertPreTrainedModel {
}
/**
 * BertForMaskedLM is a class representing a BERT model for masked language modeling.
 */
export class BertForMaskedLM extends BertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
     */
    _call(model_inputs: any): Promise<MaskedLMOutput>;
}
/**
 * BertForSequenceClassification is a class representing a BERT model for sequence classification.
 */
export class BertForSequenceClassification extends BertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
/**
 * BertForTokenClassification is a class representing a BERT model for token classification.
 */
export class BertForTokenClassification extends BertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
     */
    _call(model_inputs: any): Promise<TokenClassifierOutput>;
}
/**
 * BertForQuestionAnswering is a class representing a BERT model for question answering.
 */
export class BertForQuestionAnswering extends BertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<QuestionAnsweringModelOutput>} An object containing the model's output logits for question answering.
     */
    _call(model_inputs: any): Promise<QuestionAnsweringModelOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { MaskedLMOutput } from '../modeling_outputs.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
import { TokenClassifierOutput } from '../modeling_outputs.js';
import { QuestionAnsweringModelOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_bert.d.ts.map