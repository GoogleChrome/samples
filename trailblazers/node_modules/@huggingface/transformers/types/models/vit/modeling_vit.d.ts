export class ViTPreTrainedModel extends PreTrainedModel {
}
export class ViTModel extends ViTPreTrainedModel {
}
export class ViTForImageClassification extends ViTPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_vit.d.ts.map