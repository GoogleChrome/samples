export class HieraPreTrainedModel extends PreTrainedModel {
}
export class HieraModel extends HieraPreTrainedModel {
}
export class HieraForImageClassification extends HieraPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_hiera.d.ts.map