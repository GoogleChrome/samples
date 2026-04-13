export class FastViTPreTrainedModel extends PreTrainedModel {
}
export class FastViTModel extends FastViTPreTrainedModel {
}
export class FastViTForImageClassification extends FastViTPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_fastvit.d.ts.map