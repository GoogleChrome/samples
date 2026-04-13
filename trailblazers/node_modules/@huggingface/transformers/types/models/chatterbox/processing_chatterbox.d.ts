/**
 * Represents a ChatterboxProcessor that extracts features from an audio input.
 */
export class ChatterboxProcessor extends Processor {
    static tokenizer_class: typeof AutoTokenizer;
    static feature_extractor_class: typeof AutoFeatureExtractor;
    _call(text: any, audio?: any): Promise<any>;
}
import { Processor } from '../../processing_utils.js';
import { AutoTokenizer } from '../auto/tokenization_auto.js';
import { AutoFeatureExtractor } from '../auto/feature_extraction_auto.js';
//# sourceMappingURL=processing_chatterbox.d.ts.map