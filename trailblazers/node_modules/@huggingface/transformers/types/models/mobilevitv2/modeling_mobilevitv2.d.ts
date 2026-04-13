export class MobileViTV2PreTrainedModel extends PreTrainedModel {
}
export class MobileViTV2Model extends MobileViTV2PreTrainedModel {
}
export class MobileViTV2ForImageClassification extends MobileViTV2PreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<SequenceClassifierOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { SequenceClassifierOutput } from '../modeling_outputs.js';
//# sourceMappingURL=modeling_mobilevitv2.d.ts.map