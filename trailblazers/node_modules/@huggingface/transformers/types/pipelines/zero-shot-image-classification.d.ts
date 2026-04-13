declare const ZeroShotImageClassificationPipeline_base: new (options: TextImagePipelineConstructorArgs) => ZeroShotImageClassificationPipelineType;
/**
 * @typedef {import('./_base.js').TextImagePipelineConstructorArgs} TextImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImagePipelineInputs} ImagePipelineInputs
 * @typedef {import('./_base.js').ImageInput} ImageInput
 */
/**
 * @typedef {Object} ZeroShotImageClassificationOutputSingle
 * @property {string} label The label identified by the model. It is one of the suggested `candidate_label`.
 * @property {number} score The score attributed by the model for that label (between 0 and 1).
 *
 * @typedef {ZeroShotImageClassificationOutputSingle[]} ZeroShotImageClassificationOutput
 *
 * @typedef {Object} ZeroShotImageClassificationPipelineOptions Parameters specific to zero-shot image classification pipelines.
 * @property {string} [hypothesis_template="This is a photo of {}"] The sentence used in conjunction with `candidate_labels`
 * to attempt the image classification by replacing the placeholder with the candidate_labels.
 * Then likelihood is estimated by using `logits_per_image`.
 *
 * @callback ZeroShotImageClassificationPipelineCallbackSingle Assign labels to the image(s) passed as inputs.
 * @param {ImageInput} images The input images.
 * @param {string[]} candidate_labels The candidate labels for this image.
 * @param {ZeroShotImageClassificationPipelineOptions} [options] The options to use for zero-shot image classification.
 * @returns {Promise<ZeroShotImageClassificationOutput>} An array of objects containing the predicted labels and scores.
 *
 * @callback ZeroShotImageClassificationPipelineCallbackBatch Assign labels to the image(s) passed as inputs.
 * @param {ImageInput[]} images The input images.
 * @param {string[]} candidate_labels The candidate labels for this image.
 * @param {ZeroShotImageClassificationPipelineOptions} [options] The options to use for zero-shot image classification.
 * @returns {Promise<ZeroShotImageClassificationOutput[]>} An array of objects containing the predicted labels and scores.
 *
 * @typedef {ZeroShotImageClassificationPipelineCallbackSingle & ZeroShotImageClassificationPipelineCallbackBatch} ZeroShotImageClassificationPipelineCallback
 *
 * @typedef {TextImagePipelineConstructorArgs & ZeroShotImageClassificationPipelineCallback & Disposable} ZeroShotImageClassificationPipelineType
 */
/**
 * Zero shot image classification pipeline. This pipeline predicts the class of
 * an image when you provide an image and a set of `candidate_labels`.
 *
 * **Example:** Zero shot image classification w/ `Xenova/clip-vit-base-patch32`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * const output = await classifier(url, ['tiger', 'horse', 'dog']);
 * // [
 * //   { score: 0.9993917942047119, label: 'tiger' },
 * //   { score: 0.0003519294841680676, label: 'horse' },
 * //   { score: 0.0002562698791734874, label: 'dog' }
 * // ]
 * ```
 */
export class ZeroShotImageClassificationPipeline extends ZeroShotImageClassificationPipeline_base {
    _call(images: any, candidate_labels: any, { hypothesis_template }?: {
        hypothesis_template?: string;
    }): Promise<{
        score: any;
        label: any;
    }[] | {
        score: any;
        label: any;
    }[][]>;
}
export type TextImagePipelineConstructorArgs = import("./_base.js").TextImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImagePipelineInputs = import("./_base.js").ImagePipelineInputs;
export type ImageInput = import("./_base.js").ImageInput;
export type ZeroShotImageClassificationOutputSingle = {
    /**
     * The label identified by the model. It is one of the suggested `candidate_label`.
     */
    label: string;
    /**
     * The score attributed by the model for that label (between 0 and 1).
     */
    score: number;
};
export type ZeroShotImageClassificationOutput = ZeroShotImageClassificationOutputSingle[];
/**
 * Parameters specific to zero-shot image classification pipelines.
 */
export type ZeroShotImageClassificationPipelineOptions = {
    /**
     * The sentence used in conjunction with `candidate_labels`
     * to attempt the image classification by replacing the placeholder with the candidate_labels.
     * Then likelihood is estimated by using `logits_per_image`.
     */
    hypothesis_template?: string;
};
/**
 * Assign labels to the image(s) passed as inputs.
 */
export type ZeroShotImageClassificationPipelineCallbackSingle = (images: ImageInput, candidate_labels: string[], options?: ZeroShotImageClassificationPipelineOptions) => Promise<ZeroShotImageClassificationOutput>;
/**
 * Assign labels to the image(s) passed as inputs.
 */
export type ZeroShotImageClassificationPipelineCallbackBatch = (images: ImageInput[], candidate_labels: string[], options?: ZeroShotImageClassificationPipelineOptions) => Promise<ZeroShotImageClassificationOutput[]>;
export type ZeroShotImageClassificationPipelineCallback = ZeroShotImageClassificationPipelineCallbackSingle & ZeroShotImageClassificationPipelineCallbackBatch;
export type ZeroShotImageClassificationPipelineType = TextImagePipelineConstructorArgs & ZeroShotImageClassificationPipelineCallback & Disposable;
export {};
//# sourceMappingURL=zero-shot-image-classification.d.ts.map