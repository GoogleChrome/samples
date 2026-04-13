export class RoFormerPreTrainedModel extends PreTrainedModel {
}
/**
 * The bare RoFormer Model transformer outputting raw hidden-states without any specific head on top.
 */
export class RoFormerModel extends RoFormerPreTrainedModel {
}
/**
 * RoFormer Model with a `language modeling` head on top.
 */
export class RoFormerForMaskedLM extends RoFormerPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<MaskedLMOutput>} An object containing the model's output logits for masked language modeling.
     */
    _call(model_inputs: any): Promise<MaskedLMOutput>;
}
/**
 * RoFormer Model transformer with a sequence classification/regression head on top (a linear layer on top of the pooled output)
 */
export class RoFormerForSequenceClassification extends RoFormerPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<SequenceClassifierOutput>} An object containing the model's output logits for sequence classification.
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
/**
 * RoFormer Model with a token classification head on top (a linear layer on top of the hidden-states output)
 * e.g. for Named-Entity-Recognition (NER) tasks.
 */
export class RoFormerForTokenClassification extends RoFormerPreTrainedModel {
    /**
     * Calls the model on new inputs.
     *
     * @param {Object} model_inputs The inputs to the model.
     * @returns {Promise<TokenClassifierOutput>} An object containing the model's output logits for token classification.
     */
    _call(model_inputs: any): Promise<TokenClassifierOutput>;
}
/**
 * RoFormer Model with a span classification head on top for extractive question-answering tasks like SQuAD
 * (a linear layers on top of the hidden-states output to compute `span start logits` and `span end logits`).
 */
export class RoFormerForQuestionAnswering extends RoFormerPreTrainedModel {
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
//# sourceMappingURL=modeling_roformer.d.ts.map