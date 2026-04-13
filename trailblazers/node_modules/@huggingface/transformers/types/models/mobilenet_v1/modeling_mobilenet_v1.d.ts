export class MobileNetV1PreTrainedModel extends PreTrainedModel {
}
/**
 * The bare MobileNetV1 model outputting raw hidden-states without any specific head on top.
 */
export class MobileNetV1Model extends MobileNetV1PreTrainedModel {
}
/**
 * MobileNetV1 model with an image classification head on top (a linear layer on top of the pooled features),
 * e.g. for ImageNet.
 */
export class MobileNetV1ForImageClassification extends MobileNetV1PreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
export class MobileNetV1ForSemanticSegmentation extends MobileNetV1PreTrainedModel {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_mobilenet_v1.d.ts.map