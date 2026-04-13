declare const ImageToTextPipeline_base: new (options: TextImagePipelineConstructorArgs) => ImageToTextPipelineType;
/**
 * @typedef {import('./_base.js').TextImagePipelineConstructorArgs} TextImagePipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').ImageInput} ImageInput
 */
/**
 * @typedef {Object} ImageToTextSingle
 * @property {string} generated_text The generated text.
 * @typedef {ImageToTextSingle[]} ImageToTextOutput
 *
 * @callback ImageToTextPipelineCallbackSingle Assign labels to the image passed as input.
 * @param {ImageInput} texts The image to be captioned.
 * @param {Partial<import('../generation/parameters.js').GenerationFunctionParameters>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<ImageToTextOutput>} An object containing the generated text(s).
 *
 * @callback ImageToTextPipelineCallbackBatch Assign labels to the images passed as inputs.
 * @param {ImageInput[]} texts The images to be captioned.
 * @param {Partial<import('../generation/parameters.js').GenerationFunctionParameters>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<ImageToTextOutput[]>} An array containing the generated text(s) for each image.
 *
 * @typedef {ImageToTextPipelineCallbackSingle & ImageToTextPipelineCallbackBatch} ImageToTextPipelineCallback
 *
 * @typedef {TextImagePipelineConstructorArgs & ImageToTextPipelineCallback & Disposable} ImageToTextPipelineType
 */
/**
 * Image To Text pipeline using a `AutoModelForVision2Seq`. This pipeline predicts a caption for a given image.
 *
 * **Example:** Generate a caption for an image w/ `Xenova/vit-gpt2-image-captioning`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * const output = await captioner(url);
 * // [{ generated_text: 'a cat laying on a couch with another cat' }]
 * ```
 *
 * **Example:** Optical Character Recognition (OCR) w/ `Xenova/trocr-small-handwritten`.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const captioner = await pipeline('image-to-text', 'Xenova/trocr-small-handwritten');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/handwriting.jpg';
 * const output = await captioner(url);
 * // [{ generated_text: 'Mr. Brown commented icily.' }]
 * ```
 */
export class ImageToTextPipeline extends ImageToTextPipeline_base {
    _call(images: any, generate_kwargs?: {}): Promise<{
        generated_text: string;
    }[] | {
        generated_text: string;
    }[][]>;
}
export type TextImagePipelineConstructorArgs = import("./_base.js").TextImagePipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type ImageInput = import("./_base.js").ImageInput;
export type ImageToTextSingle = {
    /**
     * The generated text.
     */
    generated_text: string;
};
export type ImageToTextOutput = ImageToTextSingle[];
/**
 * Assign labels to the image passed as input.
 */
export type ImageToTextPipelineCallbackSingle = (texts: ImageInput, options?: Partial<import("../generation/parameters.js").GenerationFunctionParameters>) => Promise<ImageToTextOutput>;
/**
 * Assign labels to the images passed as inputs.
 */
export type ImageToTextPipelineCallbackBatch = (texts: ImageInput[], options?: Partial<import("../generation/parameters.js").GenerationFunctionParameters>) => Promise<ImageToTextOutput[]>;
export type ImageToTextPipelineCallback = ImageToTextPipelineCallbackSingle & ImageToTextPipelineCallbackBatch;
export type ImageToTextPipelineType = TextImagePipelineConstructorArgs & ImageToTextPipelineCallback & Disposable;
export {};
//# sourceMappingURL=image-to-text.d.ts.map