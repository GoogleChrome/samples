export class Dinov2PreTrainedModel extends PreTrainedModel {
}
/**
 * The bare DINOv2 Model transformer outputting raw hidden-states without any specific head on top.
 */
export class Dinov2Model extends Dinov2PreTrainedModel {
}
/**
 * Dinov2 Model transformer with an image classification head on top (a linear layer on top of the final hidden state of the [CLS] token) e.g. for ImageNet.
 */
export class Dinov2ForImageClassification extends Dinov2PreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_dinov2.d.ts.map