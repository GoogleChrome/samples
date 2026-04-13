export class ConvNextPreTrainedModel extends PreTrainedModel {
}
/**
 * The bare ConvNext model outputting raw features without any specific head on top.
 */
export class ConvNextModel extends ConvNextPreTrainedModel {
}
/**
 * ConvNext Model with an image classification head on top (a linear layer on top of the pooled features), e.g. for ImageNet.
 */
export class ConvNextForImageClassification extends ConvNextPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_convnext.d.ts.map