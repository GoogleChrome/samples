declare const DepthEstimationPipeline_base: new (options: ImagePipelineConstructorArgs) => DepthEstimationPipelineType;
/**
 * @typedef {import('./_base.js').ImagePipelineConstructorArgs} ImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImageInput} ImageInput
 */
/**
 * @typedef {Object} DepthEstimationOutput
 * @property {import('../utils/tensor.js').Tensor} predicted_depth The raw depth map predicted by the model.
 * @property {RawImage} depth The processed depth map as an image (with the same size as the input image).
 *
 * @callback DepthEstimationPipelineCallbackSingle Predicts the depth for a single image input.
 * @param {ImageInput} images The image to compute depth for.
 * @returns {Promise<DepthEstimationOutput>} An object containing the depth estimation result.
 *
 * @callback DepthEstimationPipelineCallbackBatch Predicts the depth for multiple image inputs.
 * @param {ImageInput[]} images The images to compute depth for.
 * @returns {Promise<DepthEstimationOutput[]>} A list of objects containing depth estimation results.
 *
 * @typedef {DepthEstimationPipelineCallbackSingle & DepthEstimationPipelineCallbackBatch} DepthEstimationPipelineCallback
 *
 * @typedef {ImagePipelineConstructorArgs & DepthEstimationPipelineCallback & Disposable} DepthEstimationPipelineType
 */
/**
 * Depth estimation pipeline using any `AutoModelForDepthEstimation`. This pipeline predicts the depth of an image.
 *
 * **Example:** Depth estimation w/ `onnx-community/depth-anything-v2-small`
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const depth_estimator = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small');
 * const image = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * const output = await depth_estimator(image);
 * // {
 * //   predicted_depth: Tensor {
 * //     dims: [ 480, 640 ],
 * //     type: 'float32',
 * //     data: Float32Array(307200) [ 2.6300313472747803, 2.5856235027313232, 2.620532751083374, ... ],
 * //     size: 307200
 * //   },
 * //   depth: RawImage {
 * //     data: Uint8Array(307200) [ 106, 104, 106, ... ],
 * //     width: 640,
 * //     height: 480,
 * //     channels: 1
 * //   }
 * // }
 * ```
 */
export class DepthEstimationPipeline extends DepthEstimationPipeline_base {
    _call(images: any): Promise<{
        predicted_depth: import("../transformers.js").Tensor;
        depth: RawImage;
    } | {
        predicted_depth: import("../transformers.js").Tensor;
        depth: RawImage;
    }[]>;
}
export type ImagePipelineConstructorArgs = import("./_base.js").ImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImageInput = import("./_base.js").ImageInput;
export type DepthEstimationOutput = {
    /**
     * The raw depth map predicted by the model.
     */
    predicted_depth: import("../utils/tensor.js").Tensor;
    /**
     * The processed depth map as an image (with the same size as the input image).
     */
    depth: RawImage;
};
/**
 * Predicts the depth for a single image input.
 */
export type DepthEstimationPipelineCallbackSingle = (images: ImageInput) => Promise<DepthEstimationOutput>;
/**
 * Predicts the depth for multiple image inputs.
 */
export type DepthEstimationPipelineCallbackBatch = (images: ImageInput[]) => Promise<DepthEstimationOutput[]>;
export type DepthEstimationPipelineCallback = DepthEstimationPipelineCallbackSingle & DepthEstimationPipelineCallbackBatch;
export type DepthEstimationPipelineType = ImagePipelineConstructorArgs & DepthEstimationPipelineCallback & Disposable;
import { RawImage } from '../utils/image.js';
export {};
//# sourceMappingURL=depth-estimation.d.ts.map