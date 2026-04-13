/**
 * Base class for Segment-Anything model's output.
 */
export class SamImageSegmentationOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.iou_scores The output logits of the model.
     * @param {Tensor} output.pred_masks Predicted boxes.
     */
    constructor({ iou_scores, pred_masks }: {
        iou_scores: Tensor;
        pred_masks: Tensor;
    });
    iou_scores: Tensor;
    pred_masks: Tensor;
}
export class SamPreTrainedModel extends PreTrainedModel {
}
/**
 * Segment Anything Model (SAM) for generating segmentation masks, given an input image
 * and optional 2D location and bounding boxes.
 *
 * **Example:** Perform mask generation w/ `Xenova/sam-vit-base`.
 * ```javascript
 * import { SamModel, AutoProcessor, RawImage } from '@huggingface/transformers';
 *
 * const model = await SamModel.from_pretrained('Xenova/sam-vit-base');
 * const processor = await AutoProcessor.from_pretrained('Xenova/sam-vit-base');
 *
 * const img_url = 'https://huggingface.co/ybelkada/segment-anything/resolve/main/assets/car.png';
 * const raw_image = await RawImage.read(img_url);
 * const input_points = [[[450, 600]]] // 2D localization of a window
 *
 * const inputs = await processor(raw_image, { input_points });
 * const outputs = await model(inputs);
 *
 * const masks = await processor.post_process_masks(outputs.pred_masks, inputs.original_sizes, inputs.reshaped_input_sizes);
 * // [
 * //   Tensor {
 * //     dims: [ 1, 3, 1764, 2646 ],
 * //     type: 'bool',
 * //     data: Uint8Array(14002632) [ ... ],
 * //     size: 14002632
 * //   }
 * // ]
 * const scores = outputs.iou_scores;
 * // Tensor {
 * //   dims: [ 1, 1, 3 ],
 * //   type: 'float32',
 * //   data: Float32Array(3) [
 * //     0.8892380595207214,
 * //     0.9311248064041138,
 * //     0.983696699142456
 * //   ],
 * //   size: 3
 * // }
 * ```
 */
export class SamModel extends SamPreTrainedModel {
    /**
     * Compute image embeddings and positional image embeddings, given the pixel values of an image.
     * @param {Object} model_inputs Object containing the model inputs.
     * @param {Tensor} model_inputs.pixel_values Pixel values obtained using a `SamProcessor`.
     * @returns {Promise<{ image_embeddings: Tensor, image_positional_embeddings: Tensor }>} The image embeddings and positional image embeddings.
     */
    get_image_embeddings({ pixel_values }: {
        pixel_values: Tensor;
    }): Promise<{
        image_embeddings: Tensor;
        image_positional_embeddings: Tensor;
    }>;
    /**
     * @typedef {Object} SamModelInputs Object containing the model inputs.
     * @property {Tensor} pixel_values Pixel values as a Tensor with shape `(batch_size, num_channels, height, width)`.
     * These can be obtained using a `SamProcessor`.
     * @property {Tensor} [input_points] Input 2D spatial points with shape `(batch_size, num_points, 2)`.
     * This is used by the prompt encoder to encode the prompt.
     * @property {Tensor} [input_labels] Input labels for the points, as a Tensor of shape `(batch_size, point_batch_size, num_points)`.
     * This is used by the prompt encoder to encode the prompt. There are 4 types of labels:
     *  - `1`: the point is a point that contains the object of interest
     *  - `0`: the point is a point that does not contain the object of interest
     *  - `-1`: the point corresponds to the background
     *  - `-10`: the point is a padding point, thus should be ignored by the prompt encoder
     * @property {Tensor} [input_boxes] Input bounding boxes with shape `(batch_size, num_boxes, 4)`.
     * @property {Tensor} [image_embeddings] Image embeddings used by the mask decoder.
     * @property {Tensor} [image_positional_embeddings] Image positional embeddings used by the mask decoder.
     */
    /**
     * @param {SamModelInputs} model_inputs Object containing the model inputs.
     * @returns {Promise<Object>} The output of the model.
     */
    forward(model_inputs: {
        /**
         * Pixel values as a Tensor with shape `(batch_size, num_channels, height, width)`.
         * These can be obtained using a `SamProcessor`.
         */
        pixel_values: Tensor;
        /**
         * Input 2D spatial points with shape `(batch_size, num_points, 2)`.
         * This is used by the prompt encoder to encode the prompt.
         */
        input_points?: Tensor;
        /**
         * Input labels for the points, as a Tensor of shape `(batch_size, point_batch_size, num_points)`.
         * This is used by the prompt encoder to encode the prompt. There are 4 types of labels:
         * - `1`: the point is a point that contains the object of interest
         * - `0`: the point is a point that does not contain the object of interest
         * - `-1`: the point corresponds to the background
         * - `-10`: the point is a padding point, thus should be ignored by the prompt encoder
         */
        input_labels?: Tensor;
        /**
         * Input bounding boxes with shape `(batch_size, num_boxes, 4)`.
         */
        input_boxes?: Tensor;
        /**
         * Image embeddings used by the mask decoder.
         */
        image_embeddings?: Tensor;
        /**
         * Image positional embeddings used by the mask decoder.
         */
        image_positional_embeddings?: Tensor;
    }): Promise<any>;
    /**
     * Runs the model with the provided inputs
     * @param {Object} model_inputs Model inputs
     * @returns {Promise<SamImageSegmentationOutput>} Object containing segmentation outputs
     */
    _call(model_inputs: any): Promise<SamImageSegmentationOutput>;
}
import { ModelOutput } from '../modeling_outputs.js';
import { Tensor } from '../../utils/tensor.js';
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_sam.d.ts.map