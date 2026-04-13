declare const ImageFeatureExtractionPipeline_base: new (options: ImagePipelineConstructorArgs) => ImageFeatureExtractionPipelineType;
/**
 * @typedef {import('./_base.js').ImagePipelineConstructorArgs} ImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImagePipelineInputs} ImagePipelineInputs
 */
/**
 * @typedef {Object} ImageFeatureExtractionPipelineOptions Parameters specific to image feature extraction pipelines.
 * @property {boolean} [pool=null] Whether or not to return the pooled output. If set to `false`, the model will return the raw hidden states.
 *
 * @callback ImageFeatureExtractionPipelineCallback Extract the features of the input(s).
 * @param {ImagePipelineInputs} images One or several images (or one list of images) to get the features of.
 * @param {ImageFeatureExtractionPipelineOptions} [options] The options to use for image feature extraction.
 * @returns {Promise<Tensor>} The image features computed by the model.
 *
 * @typedef {ImagePipelineConstructorArgs & ImageFeatureExtractionPipelineCallback & Disposable} ImageFeatureExtractionPipelineType
 */
/**
 * Image feature extraction pipeline using no model head. This pipeline extracts the hidden
 * states from the base transformer, which can be used as features in downstream tasks.
 *
 * **Example:** Perform image feature extraction with `onnx-community/dinov3-vits16-pretrain-lvd1689m-ONNX`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const image_feature_extractor = await pipeline('image-feature-extraction', 'onnx-community/dinov3-vits16-pretrain-lvd1689m-ONNX');
 * const image = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png';
 * const features = await image_feature_extractor(image);
 * // Tensor {
 * //   dims: [ 1, 201, 384 ],
 * //   type: 'float32',
 * //   data: Float32Array(77184) [ ... ],
 * //   size: 77184
 * // }
 * ```
 *
 * **Example:** Compute image embeddings with `Xenova/clip-vit-base-patch32`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const image_feature_extractor = await pipeline('image-feature-extraction', 'Xenova/clip-vit-base-patch32');
 * const image = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png';
 * const features = await image_feature_extractor(image);
 * // Tensor {
 * //   dims: [ 1, 512 ],
 * //   type: 'float32',
 * //   data: Float32Array(512) [ ... ],
 * //   size: 512
 * // }
 * ```
 */
export class ImageFeatureExtractionPipeline extends ImageFeatureExtractionPipeline_base {
    _call(images: ImagePipelineInputs, options?: ImageFeatureExtractionPipelineOptions): Promise<Tensor>;
}
export type ImagePipelineConstructorArgs = import("./_base.js").ImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImagePipelineInputs = import("./_base.js").ImagePipelineInputs;
/**
 * Parameters specific to image feature extraction pipelines.
 */
export type ImageFeatureExtractionPipelineOptions = {
    /**
     * Whether or not to return the pooled output. If set to `false`, the model will return the raw hidden states.
     */
    pool?: boolean;
};
/**
 * Extract the features of the input(s).
 */
export type ImageFeatureExtractionPipelineCallback = (images: ImagePipelineInputs, options?: ImageFeatureExtractionPipelineOptions) => Promise<Tensor>;
export type ImageFeatureExtractionPipelineType = ImagePipelineConstructorArgs & ImageFeatureExtractionPipelineCallback & Disposable;
import { Tensor } from '../utils/tensor.js';
export {};
//# sourceMappingURL=image-feature-extraction.d.ts.map