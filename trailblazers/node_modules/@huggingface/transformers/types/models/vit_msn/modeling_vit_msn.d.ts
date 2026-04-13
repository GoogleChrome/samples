export class ViTMSNPreTrainedModel extends PreTrainedModel {
}
export class ViTMSNModel extends ViTMSNPreTrainedModel {
}
export class ViTMSNForImageClassification extends ViTMSNPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_vit_msn.d.ts.map