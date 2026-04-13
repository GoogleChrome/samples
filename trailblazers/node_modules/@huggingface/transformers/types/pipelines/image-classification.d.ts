declare const ImageClassificationPipeline_base: new (options: ImagePipelineConstructorArgs) => ImageClassificationPipelineType;
/**
 * @typedef {import('./_base.js').ImagePipelineConstructorArgs} ImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImageInput} ImageInput
 */
/**
 * @typedef {Object} ImageClassificationSingle
 * @property {string} label The label identified by the model.
 * @property {number} score The score attributed by the model for that label.
 * @typedef {ImageClassificationSingle[]} ImageClassificationOutput
 *
 * @typedef {Object} ImageClassificationPipelineOptions Parameters specific to image classification pipelines.
 * @property {number} [top_k=1] The number of top labels that will be returned by the pipeline.
 *
 * @callback ImageClassificationPipelineCallbackSingle Assign labels to the image passed as input.
 * @param {ImageInput} images The input image to be classified.
 * @param {ImageClassificationPipelineOptions} [options] The options to use for image classification.
 * @returns {Promise<ImageClassificationOutput>} An array containing the predicted labels and scores.
 *
 * @callback ImageClassificationPipelineCallbackBatch Assign labels to the images passed as inputs.
 * @param {ImageInput[]} images The input images to be classified.
 * @param {ImageClassificationPipelineOptions} [options] The options to use for image classification.
 * @returns {Promise<ImageClassificationOutput[]>} An array where each entry contains the predictions for the corresponding input image.
 *
 * @typedef {ImageClassificationPipelineCallbackSingle & ImageClassificationPipelineCallbackBatch} ImageClassificationPipelineCallback
 *
 * @typedef {ImagePipelineConstructorArgs & ImageClassificationPipelineCallback & Disposable} ImageClassificationPipelineType
 */
/**
 * Image classification pipeline using any `AutoModelForImageClassification`.
 * This pipeline predicts the class of an image.
 *
 * **Example:** Classify an image.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * const output = await classifier(url);
 * // [
 * //   { label: 'tiger, Panthera tigris', score: 0.632695734500885 },
 * // ]
 * ```
 *
 * **Example:** Classify an image and return top `n` classes.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * const output = await classifier(url, { top_k: 3 });
 * // [
 * //   { label: 'tiger, Panthera tigris', score: 0.632695734500885 },
 * //   { label: 'tiger cat', score: 0.3634825646877289 },
 * //   { label: 'lion, king of beasts, Panthera leo', score: 0.00045060308184474707 },
 * // ]
 * ```
 *
 * **Example:** Classify an image and return all classes.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * const output = await classifier(url, { top_k: 0 });
 * // [
 * //   { label: 'tiger, Panthera tigris', score: 0.632695734500885 },
 * //   { label: 'tiger cat', score: 0.3634825646877289 },
 * //   { label: 'lion, king of beasts, Panthera leo', score: 0.00045060308184474707 },
 * //   { label: 'jaguar, panther, Panthera onca, Felis onca', score: 0.00035465499968267977 },
 * //   ...
 * // ]
 * ```
 */
export class ImageClassificationPipeline extends ImageClassificationPipeline_base {
    _call(images: any, { top_k }?: {
        top_k?: number;
    }): Promise<ImageClassificationOutput | ImageClassificationOutput[]>;
}
export type ImagePipelineConstructorArgs = import("./_base.js").ImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImageInput = import("./_base.js").ImageInput;
export type ImageClassificationSingle = {
    /**
     * The label identified by the model.
     */
    label: string;
    /**
     * The score attributed by the model for that label.
     */
    score: number;
};
export type ImageClassificationOutput = ImageClassificationSingle[];
/**
 * Parameters specific to image classification pipelines.
 */
export type ImageClassificationPipelineOptions = {
    /**
     * The number of top labels that will be returned by the pipeline.
     */
    top_k?: number;
};
/**
 * Assign labels to the image passed as input.
 */
export type ImageClassificationPipelineCallbackSingle = (images: ImageInput, options?: ImageClassificationPipelineOptions) => Promise<ImageClassificationOutput>;
/**
 * Assign labels to the images passed as inputs.
 */
export type ImageClassificationPipelineCallbackBatch = (images: ImageInput[], options?: ImageClassificationPipelineOptions) => Promise<ImageClassificationOutput[]>;
export type ImageClassificationPipelineCallback = ImageClassificationPipelineCallbackSingle & ImageClassificationPipelineCallbackBatch;
export type ImageClassificationPipelineType = ImagePipelineConstructorArgs & ImageClassificationPipelineCallback & Disposable;
export {};
//# sourceMappingURL=image-classification.d.ts.map