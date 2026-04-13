export class Sam2ImageSegmentationOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.iou_scores The output logits of the model.
     * @param {Tensor} output.pred_masks Predicted boxes.
     * @param {Tensor} output.object_score_logits Logits for the object score, indicating if an object is present.
     */
    constructor({ iou_scores, pred_masks, object_score_logits }: {
        iou_scores: Tensor;
        pred_masks: Tensor;
        object_score_logits: Tensor;
    });
    iou_scores: Tensor;
    pred_masks: Tensor;
    object_score_logits: Tensor;
}
export class Sam2PreTrainedModel extends PreTrainedModel {
}
export class Sam2Model extends Sam2PreTrainedModel {
    /**
     * Compute image embeddings and positional image embeddings, given the pixel values of an image.
     * @param {Object} model_inputs Object containing the model inputs.
     * @param {Tensor} model_inputs.pixel_values Pixel values obtained using a `Sam2Processor`.
     * @returns {Promise<Record<String, Tensor>>} The image embeddings.
     */
    get_image_embeddings({ pixel_values }: {
        pixel_values: Tensor;
    }): Promise<Record<string, Tensor>>;
    forward(model_inputs: any): Promise<any>;
    /**
     * Runs the model with the provided inputs
     * @param {Object} model_inputs Model inputs
     * @returns {Promise<Sam2ImageSegmentationOutput>} Object containing segmentation outputs
     */
    _call(model_inputs: any): Promise<Sam2ImageSegmentationOutput>;
}
export class EdgeTamModel extends Sam2Model {
}
export class Sam3TrackerModel extends Sam2Model {
}
import { ModelOutput } from '../modeling_outputs.js';
import { Tensor } from '../../utils/tensor.js';
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_sam2.d.ts.map