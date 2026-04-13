export class SwinPreTrainedModel extends PreTrainedModel {
}
export class SwinModel extends SwinPreTrainedModel {
}
export class SwinForImageClassification extends SwinPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
export class SwinForSemanticSegmentation extends SwinPreTrainedModel {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_swin.d.ts.map