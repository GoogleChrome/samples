/**
 * @typedef {string | RawImage | URL | Blob | HTMLCanvasElement | OffscreenCanvas} ImageInput
 * @typedef {ImageInput|ImageInput[]} ImagePipelineInputs
 */
/**
 * Prepare images for further tasks.
 * @param {ImagePipelineInputs} images images to prepare.
 * @returns {Promise<RawImage[]>} returns processed images.
 */
export function prepareImages(images: ImagePipelineInputs): Promise<RawImage[]>;
/**
 * @typedef {string | URL | Float32Array | Float64Array} AudioInput
 * @typedef {AudioInput|AudioInput[]} AudioPipelineInputs
 */
/**
 * Prepare audios for further tasks.
 * @param {AudioPipelineInputs} audios audios to prepare.
 * @param {number} sampling_rate sampling rate of the audios.
 * @returns {Promise<Float32Array[]>} The preprocessed audio data.
 */
export function prepareAudios(audios: AudioPipelineInputs, sampling_rate: number): Promise<Float32Array[]>;
/**
 * @typedef {Object} BoundingBox
 * @property {number} xmin The minimum x coordinate of the bounding box.
 * @property {number} ymin The minimum y coordinate of the bounding box.
 * @property {number} xmax The maximum x coordinate of the bounding box.
 * @property {number} ymax The maximum y coordinate of the bounding box.
 */
/**
 * Helper function to convert list [xmin, xmax, ymin, ymax] into object { "xmin": xmin, ... }
 * @param {number[]} box The bounding box as a list.
 * @param {boolean} asInteger Whether to cast to integers.
 * @returns {BoundingBox} The bounding box as an object.
 * @private
 */
export function get_bounding_box(box: number[], asInteger: boolean): BoundingBox;
declare const Pipeline_base: new () => {
    (...args: any[]): any;
    _call(...args: any[]): any;
};
/**
 * @callback DisposeType Disposes the item.
 * @returns {Promise<void>} A promise that resolves when the item has been disposed.
 *
 * @typedef {Object} Disposable
 * @property {DisposeType} dispose A promise that resolves when the pipeline has been disposed.
 */
/**
 * The Pipeline class is the class from which all pipelines inherit.
 * Refer to this class for methods shared across different pipelines.
 */
export class Pipeline extends Pipeline_base {
    /**
     * Create a new Pipeline.
     * @param {Object} options An object containing the following properties:
     * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
     * @param {PreTrainedModel} [options.model] The model used by the pipeline.
     * @param {PreTrainedTokenizer} [options.tokenizer=null] The tokenizer used by the pipeline (if any).
     * @param {Processor} [options.processor=null] The processor used by the pipeline (if any).
     */
    constructor({ task, model, tokenizer, processor }: {
        task?: string;
        model?: PreTrainedModel;
        tokenizer?: PreTrainedTokenizer;
        processor?: Processor;
    });
    task: string;
    model: PreTrainedModel;
    tokenizer: PreTrainedTokenizer;
    processor: Processor;
    dispose(): Promise<void>;
}
export type ImageInput = string | RawImage | URL | Blob | HTMLCanvasElement | OffscreenCanvas;
export type ImagePipelineInputs = ImageInput | ImageInput[];
export type AudioInput = string | URL | Float32Array | Float64Array;
export type AudioPipelineInputs = AudioInput | AudioInput[];
export type BoundingBox = {
    /**
     * The minimum x coordinate of the bounding box.
     */
    xmin: number;
    /**
     * The minimum y coordinate of the bounding box.
     */
    ymin: number;
    /**
     * The maximum x coordinate of the bounding box.
     */
    xmax: number;
    /**
     * The maximum y coordinate of the bounding box.
     */
    ymax: number;
};
/**
 * Disposes the item.
 */
export type DisposeType = () => Promise<void>;
export type Disposable = {
    /**
     * A promise that resolves when the pipeline has been disposed.
     */
    dispose: DisposeType;
};
export type ModelTokenizerConstructorArgs = {
    /**
     * The task of the pipeline. Useful for specifying subtasks.
     */
    task: string;
    /**
     * The model used by the pipeline.
     */
    model: PreTrainedModel;
    /**
     * The tokenizer used by the pipeline.
     */
    tokenizer: PreTrainedTokenizer;
};
/**
 * An object used to instantiate a text-based pipeline.
 */
export type TextPipelineConstructorArgs = ModelTokenizerConstructorArgs;
export type ModelProcessorConstructorArgs = {
    /**
     * The task of the pipeline. Useful for specifying subtasks.
     */
    task: string;
    /**
     * The model used by the pipeline.
     */
    model: PreTrainedModel;
    /**
     * The processor used by the pipeline.
     */
    processor: Processor;
};
/**
 * An object used to instantiate an audio-based pipeline.
 */
export type AudioPipelineConstructorArgs = ModelProcessorConstructorArgs;
/**
 * An object used to instantiate an image-based pipeline.
 */
export type ImagePipelineConstructorArgs = ModelProcessorConstructorArgs;
export type ModelTokenizerProcessorConstructorArgs = {
    /**
     * The task of the pipeline. Useful for specifying subtasks.
     */
    task: string;
    /**
     * The model used by the pipeline.
     */
    model: PreTrainedModel;
    /**
     * The tokenizer used by the pipeline.
     */
    tokenizer: PreTrainedTokenizer;
    /**
     * The processor used by the pipeline.
     */
    processor: Processor;
};
/**
 * An object used to instantiate a text- and audio-based pipeline.
 */
export type TextAudioPipelineConstructorArgs = ModelTokenizerProcessorConstructorArgs;
/**
 * An object used to instantiate a text- and image-based pipeline.
 */
export type TextImagePipelineConstructorArgs = ModelTokenizerProcessorConstructorArgs;
import { RawImage } from '../utils/image.js';
import { PreTrainedModel } from '../models/modeling_utils.js';
import { PreTrainedTokenizer } from '../tokenization_utils.js';
import { Processor } from '../processing_utils.js';
export {};
//# sourceMappingURL=_base.d.ts.map