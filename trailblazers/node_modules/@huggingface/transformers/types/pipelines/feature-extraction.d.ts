declare const FeatureExtractionPipeline_base: new (options: TextPipelineConstructorArgs) => FeatureExtractionPipelineType;
/**
 * @typedef {import('./_base.js').TextPipelineConstructorArgs} TextPipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 */
/**
 * @typedef {Object} FeatureExtractionPipelineOptions Parameters specific to feature extraction pipelines.
 * @property {'none'|'mean'|'cls'|'first_token'|'eos'|'last_token'} [pooling="none"] The pooling method to use.
 * @property {boolean} [normalize=false] Whether or not to normalize the embeddings in the last dimension.
 * @property {boolean} [quantize=false] Whether or not to quantize the embeddings.
 * @property {'binary'|'ubinary'} [precision='binary'] The precision to use for quantization.
 *
 * @callback FeatureExtractionPipelineCallback Extract the features of the input(s).
 * @param {string|string[]} texts One or several texts (or one list of texts) to get the features of.
 * @param {FeatureExtractionPipelineOptions} [options] The options to use for feature extraction.
 * @returns {Promise<Tensor>} The features computed by the model.
 *
 * @typedef {TextPipelineConstructorArgs & FeatureExtractionPipelineCallback & Disposable} FeatureExtractionPipelineType
 */
/**
 * Feature extraction pipeline using no model head. This pipeline extracts the hidden
 * states from the base transformer, which can be used as features in downstream tasks.
 *
 * **Example:** Run feature extraction using `onnx-community/all-MiniLM-L6-v2-ONNX` (without pooling or normalization).
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const extractor = await pipeline('feature-extraction', 'onnx-community/all-MiniLM-L6-v2-ONNX');
 * const output = await extractor('This is a simple test.');
 * // Tensor {
 * //   type: 'float32',
 * //   data: Float32Array [0.2157987803220749, -0.09140099585056305, ...],
 * //   dims: [1, 8, 384]
 * // }
 *
 * // You can convert this Tensor to a nested JavaScript array using `.tolist()`:
 * console.log(output.tolist());
 * ```
 *
 * **Example:** Run feature extraction using `onnx-community/all-MiniLM-L6-v2-ONNX` (with pooling and normalization).
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const extractor = await pipeline('feature-extraction', 'onnx-community/all-MiniLM-L6-v2-ONNX');
 * const output = await extractor('This is a simple test.', { pooling: 'mean', normalize: true });
 * // Tensor {
 * //   type: 'float32',
 * //   data: Float32Array [0.09528215229511261, -0.024730168282985687, ...],
 * //   dims: [1, 384]
 * // }
 *
 * // You can convert this Tensor to a nested JavaScript array using `.tolist()`:
 * console.log(output.tolist());
 * ```
 *
 * **Example:** Run feature extraction using `onnx-community/all-MiniLM-L6-v2-ONNX` models (with pooling and binary quantization).
 * ```javascript
 * const extractor = await pipeline('feature-extraction', 'onnx-community/all-MiniLM-L6-v2-ONNX');
 * const output = await extractor('This is a simple test.', { pooling: 'mean', quantize: true, precision: 'binary' });
 * // Tensor {
 * //   type: 'int8',
 * //   data: Int8Array [49, 108, 25, ...],
 * //   dims: [1, 48]
 * // }
 *
 * // You can convert this Tensor to a nested JavaScript array using `.tolist()`:
 * console.log(output.tolist());
 * ```
 */
export class FeatureExtractionPipeline extends FeatureExtractionPipeline_base {
    _call(texts: string | string[], options?: FeatureExtractionPipelineOptions): Promise<Tensor>;
}
export type TextPipelineConstructorArgs = import("./_base.js").TextPipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
/**
 * Parameters specific to feature extraction pipelines.
 */
export type FeatureExtractionPipelineOptions = {
    /**
     * The pooling method to use.
     */
    pooling?: "none" | "mean" | "cls" | "first_token" | "eos" | "last_token";
    /**
     * Whether or not to normalize the embeddings in the last dimension.
     */
    normalize?: boolean;
    /**
     * Whether or not to quantize the embeddings.
     */
    quantize?: boolean;
    /**
     * The precision to use for quantization.
     */
    precision?: "binary" | "ubinary";
};
/**
 * Extract the features of the input(s).
 */
export type FeatureExtractionPipelineCallback = (texts: string | string[], options?: FeatureExtractionPipelineOptions) => Promise<Tensor>;
export type FeatureExtractionPipelineType = TextPipelineConstructorArgs & FeatureExtractionPipelineCallback & Disposable;
import { Tensor } from '../utils/tensor.js';
export {};
//# sourceMappingURL=feature-extraction.d.ts.map