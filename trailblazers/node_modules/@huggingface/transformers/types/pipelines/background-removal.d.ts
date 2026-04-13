declare const BackgroundRemovalPipeline_base: new (options: ImagePipelineConstructorArgs) => BackgroundRemovalPipelineType;
/**
 * @typedef {import('./_base.js').ImagePipelineConstructorArgs} ImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImageInput} ImageInput
 */
/**
 * @typedef {Object} BackgroundRemovalPipelineOptions Parameters specific to background removal pipelines.
 *
 * @callback BackgroundRemovalPipelineCallbackSingle Remove the background from the image passed as input.
 * @param {ImageInput} images The input image.
 * @param {BackgroundRemovalPipelineOptions} [options] The options to use for background removal.
 * @returns {Promise<RawImage>} The image with the background removed.
 *
 * @callback BackgroundRemovalPipelineCallbackBatch Remove the background from the images passed as inputs.
 * @param {ImageInput[]} images The input images.
 * @param {BackgroundRemovalPipelineOptions} [options] The options to use for background removal.
 * @returns {Promise<RawImage[]>} The images with the background removed.
 *
 * @typedef {BackgroundRemovalPipelineCallbackSingle & BackgroundRemovalPipelineCallbackBatch} BackgroundRemovalPipelineCallback
 *
 * @typedef {ImagePipelineConstructorArgs & BackgroundRemovalPipelineCallback & Disposable} BackgroundRemovalPipelineType
 */
/**
 * Background removal pipeline using certain `AutoModelForXXXSegmentation`.
 * This pipeline removes the backgrounds of images.
 *
 * **Example:** Perform background removal with `Xenova/modnet`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const segmenter = await pipeline('background-removal', 'Xenova/modnet');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/portrait-of-woman_small.jpg';
 * const output = await segmenter(url);
 * // RawImage { data: Uint8ClampedArray(648000) [ ... ], width: 360, height: 450, channels: 4 }
 * ```
 */
export class BackgroundRemovalPipeline extends BackgroundRemovalPipeline_base {
    _call(images: any, options?: {}): Promise<RawImage | RawImage[]>;
}
export type ImagePipelineConstructorArgs = import("./_base.js").ImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImageInput = import("./_base.js").ImageInput;
/**
 * Parameters specific to background removal pipelines.
 */
export type BackgroundRemovalPipelineOptions = any;
/**
 * Remove the background from the image passed as input.
 */
export type BackgroundRemovalPipelineCallbackSingle = (images: ImageInput, options?: BackgroundRemovalPipelineOptions) => Promise<RawImage>;
/**
 * Remove the background from the images passed as inputs.
 */
export type BackgroundRemovalPipelineCallbackBatch = (images: ImageInput[], options?: BackgroundRemovalPipelineOptions) => Promise<RawImage[]>;
export type BackgroundRemovalPipelineCallback = BackgroundRemovalPipelineCallbackSingle & BackgroundRemovalPipelineCallbackBatch;
export type BackgroundRemovalPipelineType = ImagePipelineConstructorArgs & BackgroundRemovalPipelineCallback & Disposable;
import { RawImage } from '../utils/image.js';
export {};
//# sourceMappingURL=background-removal.d.ts.map