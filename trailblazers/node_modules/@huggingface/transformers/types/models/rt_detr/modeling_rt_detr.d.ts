export class RTDetrPreTrainedModel extends PreTrainedModel {
}
export class RTDetrModel extends RTDetrPreTrainedModel {
}
export class RTDetrForObjectDetection extends RTDetrPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<RTDetrObjectDetectionOutput>;
}
export class RTDetrObjectDetectionOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.logits Classification logits (including no-object) for all queries.
     * @param {Tensor} output.pred_boxes Normalized boxes coordinates for all queries, represented as (center_x, center_y, width, height).
     * These values are normalized in [0, 1], relative to the size of each individual image in the batch (disregarding possible padding).
     */
    constructor({ logits, pred_boxes }: {
        logits: Tensor;
        pred_boxes: Tensor;
    });
    logits: Tensor;
    pred_boxes: Tensor;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { ModelOutput } from '../modeling_outputs.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=modeling_rt_detr.d.ts.map