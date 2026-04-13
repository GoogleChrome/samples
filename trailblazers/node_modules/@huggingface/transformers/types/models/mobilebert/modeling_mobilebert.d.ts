export class MobileBertPreTrainedModel extends PreTrainedModel {
}
export class MobileBertModel extends MobileBertPreTrainedModel {
}
/**
 * MobileBertForMaskedLM is a class representing a MobileBERT model for masking task.
 */
export class MobileBertForMaskedLM extends MobileBertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<MaskedLMOutput>} returned object
     */
    _call(model_inputs: any): Promise<MaskedLMOutput>;
}
/**
 * MobileBert Model transformer with a sequence classification/regression head on top (a linear layer on top of the pooled output)
 */
export class MobileBertForSequenceClassification extends MobileBertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} returned object
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
/**
 * MobileBert Model with a span classification head on top for extractive question-answering tasks
 */
export class MobileBertForQuestionAnswering extends MobileBertPreTrainedModel {
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
import { QuestionAnsweringModelOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_mobilebert.d.ts.map