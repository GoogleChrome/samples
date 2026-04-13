declare const ObjectDetectionPipeline_base: new (options: ImagePipelineConstructorArgs) => ObjectDetectionPipelineType;
/**
 * @typedef {import('./_base.js').ImagePipelineConstructorArgs} ImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImageInput} ImageInput
 * @typedef {import('./_base.js').BoundingBox} BoundingBox
 */
/**
 * @typedef {Object} ObjectDetectionPipelineSingle
 * @property {string} label The class label identified by the model.
 * @property {number} score The score attributed by the model for that label.
 * @property {BoundingBox} box The bounding box of detected object in image's original size, or as a percentage if `percentage` is set to true.
 * @typedef {ObjectDetectionPipelineSingle[]} ObjectDetectionOutput
 *
 * @typedef {Object} ObjectDetectionPipelineOptions Parameters specific to object detection pipelines.
 * @property {number} [threshold=0.9] The threshold used to filter boxes by score.
 * @property {boolean} [percentage=false] Whether to return the boxes coordinates in percentage (true) or in pixels (false).
 *
 * @callback ObjectDetectionPipelineCallbackSingle Detect objects (bounding boxes & classes) in the image passed as input.
 * @param {ImageInput} images The input image.
 * @param {ObjectDetectionPipelineOptions} [options] The options to use for object detection.
 * @returns {Promise<ObjectDetectionOutput>} A list of detected objects.
 *
 * @callback ObjectDetectionPipelineCallbackBatch Detect objects (bounding boxes & classes) in the images passed as inputs.
 * @param {ImageInput[]} images The input images.
 * @param {ObjectDetectionPipelineOptions} [options] The options to use for object detection.
 * @returns {Promise<ObjectDetectionOutput[]>} A list where each entry contains the detections for the corresponding input image.
 *
 * @typedef {ObjectDetectionPipelineCallbackSingle & ObjectDetectionPipelineCallbackBatch} ObjectDetectionPipelineCallback
 *
 * @typedef {ImagePipelineConstructorArgs & ObjectDetectionPipelineCallback & Disposable} ObjectDetectionPipelineType
 */
/**
 * Object detection pipeline using any `AutoModelForObjectDetection`.
 * This pipeline predicts bounding boxes of objects and their classes.
 *
 * **Example:** Run object-detection with `Xenova/detr-resnet-50`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
 * const img = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * const output = await detector(img, { threshold: 0.9 });
 * // [{
 * //   score: 0.9976370930671692,
 * //   label: "remote",
 * //   box: { xmin: 31, ymin: 68, xmax: 190, ymax: 118 }
 * // },
 * // ...
 * // {
 * //   score: 0.9984092116355896,
 * //   label: "cat",
 * //   box: { xmin: 331, ymin: 19, xmax: 649, ymax: 371 }
 * // }]
 * ```
 */
export class ObjectDetectionPipeline extends ObjectDetectionPipeline_base {
    _call(images: any, { threshold, percentage }?: {
        threshold?: number;
        percentage?: boolean;
    }): Promise<ObjectDetectionOutput | ObjectDetectionOutput[]>;
}
export type ImagePipelineConstructorArgs = import("./_base.js").ImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImageInput = import("./_base.js").ImageInput;
export type BoundingBox = import("./_base.js").BoundingBox;
export type ObjectDetectionPipelineSingle = {
    /**
     * The class label identified by the model.
     */
    label: string;
    /**
     * The score attributed by the model for that label.
     */
    score: number;
    /**
     * The bounding box of detected object in image's original size, or as a percentage if `percentage` is set to true.
     */
    box: BoundingBox;
};
export type ObjectDetectionOutput = ObjectDetectionPipelineSingle[];
/**
 * Parameters specific to object detection pipelines.
 */
export type ObjectDetectionPipelineOptions = {
    /**
     * The threshold used to filter boxes by score.
     */
    threshold?: number;
    /**
     * Whether to return the boxes coordinates in percentage (true) or in pixels (false).
     */
    percentage?: boolean;
};
/**
 * Detect objects (bounding boxes & classes) in the image passed as input.
 */
export type ObjectDetectionPipelineCallbackSingle = (images: ImageInput, options?: ObjectDetectionPipelineOptions) => Promise<ObjectDetectionOutput>;
/**
 * Detect objects (bounding boxes & classes) in the images passed as inputs.
 */
export type ObjectDetectionPipelineCallbackBatch = (images: ImageInput[], options?: ObjectDetectionPipelineOptions) => Promise<ObjectDetectionOutput[]>;
export type ObjectDetectionPipelineCallback = ObjectDetectionPipelineCallbackSingle & ObjectDetectionPipelineCallbackBatch;
export type ObjectDetectionPipelineType = ImagePipelineConstructorArgs & ObjectDetectionPipelineCallback & Disposable;
export {};
//# sourceMappingURL=object-detection.d.ts.map