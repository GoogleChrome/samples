export class Qwen2VLProcessor extends Processor {
    static image_processor_class: typeof AutoImageProcessor;
    static tokenizer_class: typeof AutoTokenizer;
    static image_token: string;
    /**
     *
     * @param {string|string[]} text
     * @param {RawImage|RawImage[]} images
     * @param  {...any} args
     * @returns {Promise<any>}
     */
    _call(text: string | string[], images?: RawImage | RawImage[], ...args: any[]): Promise<any>;
}
import { Processor } from '../../processing_utils.js';
import { RawImage } from '../../utils/image.js';
import { AutoImageProcessor } from '../auto/image_processing_auto.js';
import { AutoTokenizer } from '../auto/tokenization_auto.js';
//# sourceMappingURL=processing_qwen2_vl.d.ts.map