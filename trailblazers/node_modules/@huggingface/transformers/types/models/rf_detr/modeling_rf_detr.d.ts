export class RFDetrPreTrainedModel extends PreTrainedModel {
}
export class RFDetrModel extends RFDetrPreTrainedModel {
}
export class RFDetrForObjectDetection extends RFDetrPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<RFDetrObjectDetectionOutput>;
}
export class RFDetrObjectDetectionOutput extends RTDetrObjectDetectionOutput {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { RTDetrObjectDetectionOutput } from '../rt_detr/modeling_rt_detr.js';
//# sourceMappingURL=modeling_rf_detr.d.ts.map