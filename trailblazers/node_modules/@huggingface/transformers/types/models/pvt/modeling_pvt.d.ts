export class PvtPreTrainedModel extends PreTrainedModel {
}
export class PvtModel extends PvtPreTrainedModel {
}
export class PvtForImageClassification extends PvtPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_pvt.d.ts.map