export class RTDetrV2PreTrainedModel extends PreTrainedModel {
}
export class RTDetrV2Model extends RTDetrV2PreTrainedModel {
}
export class RTDetrV2ForObjectDetection extends RTDetrV2PreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<RTDetrV2ObjectDetectionOutput>;
}
export class RTDetrV2ObjectDetectionOutput extends RTDetrObjectDetectionOutput {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { RTDetrObjectDetectionOutput } from '../rt_detr/modeling_rt_detr.js';
//# sourceMappingURL=modeling_rt_detr_v2.d.ts.map