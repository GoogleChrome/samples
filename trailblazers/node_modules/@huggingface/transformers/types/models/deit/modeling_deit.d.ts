export class DeiTPreTrainedModel extends PreTrainedModel {
}
export class DeiTModel extends DeiTPreTrainedModel {
}
export class DeiTForImageClassification extends DeiTPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_deit.d.ts.map