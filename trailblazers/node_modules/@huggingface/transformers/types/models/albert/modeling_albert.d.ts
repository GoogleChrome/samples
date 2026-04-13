export class AlbertPreTrainedModel extends PreTrainedModel {
}
export class AlbertModel extends AlbertPreTrainedModel {
}
export class AlbertForSequenceClassification extends AlbertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} returned object
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
export class AlbertForQuestionAnswering extends AlbertPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<QuestionAnsweringModelOutput>} returned object
     */
    _call(model_inputs: any): Promise<QuestionAnsweringModelOutput>;
}
export class AlbertForMaskedLM extends AlbertPreTrainedModel {
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
import { QuestionAnsweringModelOutput } from '../modeling_outputs.js';
import { MaskedLMOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_albert.d.ts.map