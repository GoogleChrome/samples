/**
 * @typedef {import('../../utils/image.js').RawImage} RawImage
 */
export class Lfm2VlProcessor extends Processor {
    static tokenizer_class: typeof AutoTokenizer;
    static image_processor_class: typeof AutoImageProcessor;
    /**
     * @param {RawImage|RawImage[]} images
     * @param {string|string[]|null} [text]
     * @param {Record<string, any>} [kwargs]
     */
    _call(images: RawImage | RawImage[], text?: string | string[] | null, kwargs?: Record<string, any>): Promise<any>;
}
export type RawImage = import("../../utils/image.js").RawImage;
import { Processor } from '../../processing_utils.js';
import { AutoTokenizer } from '../auto/tokenization_auto.js';
import { AutoImageProcessor } from '../auto/image_processing_auto.js';
//# sourceMappingURL=processing_lfm2_vl.d.ts.map