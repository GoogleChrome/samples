export class MobileNetV2PreTrainedModel extends PreTrainedModel {
}
/**
 * The bare MobileNetV2 model outputting raw hidden-states without any specific head on top.
 */
export class MobileNetV2Model extends MobileNetV2PreTrainedModel {
}
/**
 * MobileNetV2 model with an image classification head on top (a linear layer on top of the pooled features),
 * e.g. for ImageNet.
 */
export class MobileNetV2ForImageClassification extends MobileNetV2PreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
export class MobileNetV2ForSemanticSegmentation extends MobileNetV2PreTrainedModel {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_mobilenet_v2.d.ts.map