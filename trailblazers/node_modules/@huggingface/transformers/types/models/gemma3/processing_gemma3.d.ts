export class Gemma3Processor extends Processor {
    static tokenizer_class: typeof AutoTokenizer;
    static image_processor_class: typeof AutoImageProcessor;
    constructor(config: any, components: any, chat_template: any);
    image_seq_length: any;
    boi_token: any;
    image_token: any;
    eoi_token: any;
    full_image_sequence: string;
    /**
     * @param {string|string[]} text
     * @param {import('../../utils/image.js').RawImage|import('../../utils/image.js').RawImage[]} [images]
     * @param {Object} [options]
     */
    _call(text: string | string[], images?: import("../../utils/image.js").RawImage | import("../../utils/image.js").RawImage[], options?: any): Promise<any>;
}
import { Processor } from '../../processing_utils.js';
import { AutoTokenizer } from '../auto/tokenization_auto.js';
import { AutoImageProcessor } from '../auto/image_processing_auto.js';
//# sourceMappingURL=processing_gemma3.d.ts.map