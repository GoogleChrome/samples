export class DFinePreTrainedModel extends PreTrainedModel {
}
export class DFineModel extends DFinePreTrainedModel {
}
export class DFineForObjectDetection extends DFinePreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<RTDetrObjectDetectionOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { RTDetrObjectDetectionOutput } from '../rt_detr/modeling_rt_detr.js';
//# sourceMappingURL=modeling_d_fine.d.ts.map