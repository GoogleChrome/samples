export class PaliGemmaProcessor extends Processor {
    static tokenizer_class: typeof AutoTokenizer;
    static image_processor_class: typeof AutoImageProcessor;
    /**
     * @typedef {import('../../utils/image.js').RawImage} RawImage
     */
    _call(images: import("../../transformers.js").RawImage | import("../../transformers.js").RawImage[], text?: any, kwargs?: {}): Promise<any>;
}
import { Processor } from '../../processing_utils.js';
import { AutoTokenizer } from '../auto/tokenization_auto.js';
import { AutoImageProcessor } from '../auto/image_processing_auto.js';
//# sourceMappingURL=processing_paligemma.d.ts.map