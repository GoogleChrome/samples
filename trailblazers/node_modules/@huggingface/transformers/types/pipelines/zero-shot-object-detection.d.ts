declare const ZeroShotObjectDetectionPipeline_base: new (options: TextImagePipelineConstructorArgs) => ZeroShotObjectDetectionPipelineType;
/**
 * @typedef {import('./_base.js').TextImagePipelineConstructorArgs} TextImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImageInput} ImageInput
 * @typedef {import('./_base.js').BoundingBox} BoundingBox
 */
/**
 * @typedef {Object} ZeroShotObjectDetectionOutputSingle
 * @property {string} label Text query corresponding to the found object.
 * @property {number} score Score corresponding to the object (between 0 and 1).
 * @property {BoundingBox} box Bounding box of the detected object in image's original size, or as a percentage if `percentage` is set to true.
 *
 * @typedef {ZeroShotObjectDetectionOutputSingle[]} ZeroShotObjectDetectionOutput
 *
 * @typedef {Object} ZeroShotObjectDetectionPipelineOptions Parameters specific to zero-shot object detection pipelines.
 * @property {number} [threshold=0.1] The probability necessary to make a prediction.
 * @property {number} [top_k=null] The number of top predictions that will be returned by the pipeline.
 * If the provided number is `null` or higher than the number of predictions available, it will default
 * to the number of predictions.
 * @property {boolean} [percentage=false] Whether to return the boxes coordinates in percentage (true) or in pixels (false).
 *
 * @callback ZeroShotObjectDetectionPipelineCallbackSingle Detect objects (bounding boxes & classes) in the image(s) passed as inputs.
 * @param {ImageInput} images The input images.
 * @param {string[]} candidate_labels What the model should recognize in the image.
 * @param {ZeroShotObjectDetectionPipelineOptions} [options] The options to use for zero-shot object detection.
 * @returns {Promise<ZeroShotObjectDetectionOutput>} An array of objects containing the predicted labels, scores, and bounding boxes.
 *
 * @callback ZeroShotObjectDetectionPipelineCallbackBatch Detect objects (bounding boxes & classes) in the image(s) passed as inputs.
 * @param {ImageInput[]} images The input images.
 * @param {string[]} candidate_labels What the model should recognize in the image.
 * @param {ZeroShotObjectDetectionPipelineOptions} [options] The options to use for zero-shot object detection.
 * @returns {Promise<ZeroShotObjectDetectionOutput[]>} An array of objects containing the predicted labels, scores, and bounding boxes.
 *
 * @typedef {ZeroShotObjectDetectionPipelineCallbackSingle & ZeroShotObjectDetectionPipelineCallbackBatch} ZeroShotObjectDetectionPipelineCallback
 *
 * @typedef {TextImagePipelineConstructorArgs & ZeroShotObjectDetectionPipelineCallback & Disposable} ZeroShotObjectDetectionPipelineType
 */
/**
 * Zero-shot object detection pipeline. This pipeline predicts bounding boxes of
 * objects when you provide an image and a set of `candidate_labels`.
 *
 * **Example:** Zero-shot object detection w/ `Xenova/owlvit-base-patch32`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const detector = await pipeline('zero-shot-object-detection', 'Xenova/owlvit-base-patch32');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/astronaut.png';
 * const candidate_labels = ['human face', 'rocket', 'helmet', 'american flag'];
 * const output = await detector(url, candidate_labels);
 * // [
 * //   {
 * //     score: 0.24392342567443848,
 * //     label: 'human face',
 * //     box: { xmin: 180, ymin: 67, xmax: 274, ymax: 175 }
 * //   },
 * //   {
 * //     score: 0.15129457414150238,
 * //     label: 'american flag',
 * //     box: { xmin: 0, ymin: 4, xmax: 106, ymax: 513 }
 * //   },
 * //   {
 * //     score: 0.13649864494800568,
 * //     label: 'helmet',
 * //     box: { xmin: 277, ymin: 337, xmax: 511, ymax: 511 }
 * //   },
 * //   {
 * //     score: 0.10262022167444229,
 * //     label: 'rocket',
 * //     box: { xmin: 352, ymin: -1, xmax: 463, ymax: 287 }
 * //   }
 * // ]
 * ```
 *
 * **Example:** Zero-shot object detection w/ `Xenova/owlvit-base-patch32` (returning top 4 matches and setting a threshold).
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const detector = await pipeline('zero-shot-object-detection', 'Xenova/owlvit-base-patch32');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/beach.png';
 * const candidate_labels = ['hat', 'book', 'sunglasses', 'camera'];
 * const output = await detector(url, candidate_labels, { top_k: 4, threshold: 0.05 });
 * // [
 * //   {
 * //     score: 0.1606510728597641,
 * //     label: 'sunglasses',
 * //     box: { xmin: 347, ymin: 229, xmax: 429, ymax: 264 }
 * //   },
 * //   {
 * //     score: 0.08935828506946564,
 * //     label: 'hat',
 * //     box: { xmin: 38, ymin: 174, xmax: 258, ymax: 364 }
 * //   },
 * //   {
 * //     score: 0.08530698716640472,
 * //     label: 'camera',
 * //     box: { xmin: 187, ymin: 350, xmax: 260, ymax: 411 }
 * //   },
 * //   {
 * //     score: 0.08349756896495819,
 * //     label: 'book',
 * //     box: { xmin: 261, ymin: 280, xmax: 494, ymax: 425 }
 * //   }
 * // ]
 * ```
 */
export class ZeroShotObjectDetectionPipeline extends ZeroShotObjectDetectionPipeline_base {
    _call(images: any, candidate_labels: any, { threshold, top_k, percentage }?: {
        threshold?: number;
        top_k?: any;
        percentage?: boolean;
    }): Promise<any>;
}
export type TextImagePipelineConstructorArgs = import("./_base.js").TextImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImageInput = import("./_base.js").ImageInput;
export type BoundingBox = import("./_base.js").BoundingBox;
export type ZeroShotObjectDetectionOutputSingle = {
    /**
     * Text query corresponding to the found object.
     */
    label: string;
    /**
     * Score corresponding to the object (between 0 and 1).
     */
    score: number;
    /**
     * Bounding box of the detected object in image's original size, or as a percentage if `percentage` is set to true.
     */
    box: BoundingBox;
};
export type ZeroShotObjectDetectionOutput = ZeroShotObjectDetectionOutputSingle[];
/**
 * Parameters specific to zero-shot object detection pipelines.
 */
export type ZeroShotObjectDetectionPipelineOptions = {
    /**
     * The probability necessary to make a prediction.
     */
    threshold?: number;
    /**
     * The number of top predictions that will be returned by the pipeline.
     * If the provided number is `null` or higher than the number of predictions available, it will default
     * to the number of predictions.
     */
    top_k?: number;
    /**
     * Whether to return the boxes coordinates in percentage (true) or in pixels (false).
     */
    percentage?: boolean;
};
/**
 * Detect objects (bounding boxes & classes) in the image(s) passed as inputs.
 */
export type ZeroShotObjectDetectionPipelineCallbackSingle = (images: ImageInput, candidate_labels: string[], options?: ZeroShotObjectDetectionPipelineOptions) => Promise<ZeroShotObjectDetectionOutput>;
/**
 * Detect objects (bounding boxes & classes) in the image(s) passed as inputs.
 */
export type ZeroShotObjectDetectionPipelineCallbackBatch = (images: ImageInput[], candidate_labels: string[], options?: ZeroShotObjectDetectionPipelineOptions) => Promise<ZeroShotObjectDetectionOutput[]>;
export type ZeroShotObjectDetectionPipelineCallback = ZeroShotObjectDetectionPipelineCallbackSingle & ZeroShotObjectDetectionPipelineCallbackBatch;
export type ZeroShotObjectDetectionPipelineType = TextImagePipelineConstructorArgs & ZeroShotObjectDetectionPipelineCallback & Disposable;
export {};
//# sourceMappingURL=zero-shot-object-detection.d.ts.map