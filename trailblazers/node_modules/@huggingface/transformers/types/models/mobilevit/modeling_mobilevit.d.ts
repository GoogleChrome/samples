export class MobileViTPreTrainedModel extends PreTrainedModel {
}
export class MobileViTModel extends MobileViTPreTrainedModel {
}
export class MobileViTForImageClassification extends MobileViTPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_mobilevit.d.ts.map