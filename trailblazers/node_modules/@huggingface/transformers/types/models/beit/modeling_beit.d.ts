export class BeitPreTrainedModel extends PreTrainedModel {
}
export class BeitModel extends BeitPreTrainedModel {
}
export class BeitForImageClassification extends BeitPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_beit.d.ts.map