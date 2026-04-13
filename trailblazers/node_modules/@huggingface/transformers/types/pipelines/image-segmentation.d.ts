declare const ImageSegmentationPipeline_base: new (options: ImagePipelineConstructorArgs) => ImageSegmentationPipelineType;
/**
 * @typedef {Object} ImageSegmentationOutputSingle
 * @property {string|null} label The label of the segment.
 * @property {number|null} score The score of the segment.
 * @property {RawImage} mask The mask of the segment.
 *
 * @typedef {ImageSegmentationOutputSingle[]} ImageSegmentationOutput
 *
 * @typedef {Object} ImageSegmentationPipelineOptions Parameters specific to image segmentation pipelines.
 * @property {number} [threshold=0.5] Probability threshold to filter out predicted masks.
 * @property {number} [mask_threshold=0.5] Threshold to use when turning the predicted masks into binary values.
 * @property {number} [overlap_mask_area_threshold=0.8] Mask overlap threshold to eliminate small, disconnected segments.
 * @property {null|string} [subtask=null] Segmentation task to be performed. One of [`panoptic`, `instance`, and `semantic`],
 * depending on model capabilities. If not set, the pipeline will attempt to resolve (in that order).
 * @property {number[]} [label_ids_to_fuse=null] List of label ids to fuse. If not set, do not fuse any labels.
 * @property {number[][]} [target_sizes=null] List of target sizes for the input images. If not set, use the original image sizes.
 *
 * @callback ImageSegmentationPipelineCallback Segment the input images.
 * @param {ImagePipelineInputs} images The input images.
 * @param {ImageSegmentationPipelineOptions} [options] The options to use for image segmentation.
 * @returns {Promise<ImageSegmentationOutput>} The annotated segments.
 *
 * @typedef {ImagePipelineConstructorArgs & ImageSegmentationPipelineCallback & Disposable} ImageSegmentationPipelineType
 */
/**
 * Image segmentation pipeline using any `AutoModelForXXXSegmentation`.
 * This pipeline predicts masks of objects and their classes.
 *
 * **Example:** Perform image segmentation with `Xenova/detr-resnet-50-panoptic`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const segmenter = await pipeline('image-segmentation', 'Xenova/detr-resnet-50-panoptic');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * const output = await segmenter(url);
 * // [
 * //   { label: 'remote', score: 0.9984649419784546, mask: RawImage { ... } },
 * //   { label: 'cat', score: 0.9994316101074219, mask: RawImage { ... } }
 * // ]
 * ```
 */
export class ImageSegmentationPipeline extends ImageSegmentationPipeline_base {
    _call(images: ImagePipelineInputs, options?: ImageSegmentationPipelineOptions): Promise<ImageSegmentationOutput>;
}
export type ImagePipelineConstructorArgs = import("./_base.js").ImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImagePipelineInputs = import("./_base.js").ImagePipelineInputs;
export type ImageSegmentationOutputSingle = {
    /**
     * The label of the segment.
     */
    label: string | null;
    /**
     * The score of the segment.
     */
    score: number | null;
    /**
     * The mask of the segment.
     */
    mask: RawImage;
};
export type ImageSegmentationOutput = ImageSegmentationOutputSingle[];
/**
 * Parameters specific to image segmentation pipelines.
 */
export type ImageSegmentationPipelineOptions = {
    /**
     * Probability threshold to filter out predicted masks.
     */
    threshold?: number;
    /**
     * Threshold to use when turning the predicted masks into binary values.
     */
    mask_threshold?: number;
    /**
     * Mask overlap threshold to eliminate small, disconnected segments.
     */
    overlap_mask_area_threshold?: number;
    /**
     * Segmentation task to be performed. One of [`panoptic`, `instance`, and `semantic`],
     * depending on model capabilities. If not set, the pipeline will attempt to resolve (in that order).
     */
    subtask?: null | string;
    /**
     * List of label ids to fuse. If not set, do not fuse any labels.
     */
    label_ids_to_fuse?: number[];
    /**
     * List of target sizes for the input images. If not set, use the original image sizes.
     */
    target_sizes?: number[][];
};
/**
 * Segment the input images.
 */
export type ImageSegmentationPipelineCallback = (images: ImagePipelineInputs, options?: ImageSegmentationPipelineOptions) => Promise<ImageSegmentationOutput>;
export type ImageSegmentationPipelineType = ImagePipelineConstructorArgs & ImageSegmentationPipelineCallback & Disposable;
import { RawImage } from '../utils/image.js';
export {};
//# sourceMappingURL=image-segmentation.d.ts.map