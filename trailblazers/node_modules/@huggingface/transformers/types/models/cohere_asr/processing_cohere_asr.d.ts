export class CohereAsrProcessor extends Processor {
    static tokenizer_class: typeof AutoTokenizer;
    static feature_extractor_class: typeof AutoFeatureExtractor;
    /**
     * Join chunk texts back together, using the appropriate separator for the language.
     * @param {string[]} texts Decoded texts, one per chunk.
     * @param {string} [language='en'] Language code.
     * @returns {string} The joined text.
     */
    static join_chunks(texts: string[], language?: string): string;
    /**
     * Build the 10-token decoder prompt for the given language.
     * @param {string} [language='en'] Language code.
     * @returns {number[]} Token IDs for the decoder prompt.
     */
    get_decoder_prompt_ids(language?: string): number[];
    /**
     * Calls the feature_extractor function with the given audio input.
     * @param {any} audio The audio input to extract features from.
     * @returns {Promise<any>}
     */
    _call(audio: any): Promise<any>;
}
import { Processor } from '../../processing_utils.js';
import { AutoTokenizer } from '../auto/tokenization_auto.js';
import { AutoFeatureExtractor } from '../auto/feature_extraction_auto.js';
//# sourceMappingURL=processing_cohere_asr.d.ts.map