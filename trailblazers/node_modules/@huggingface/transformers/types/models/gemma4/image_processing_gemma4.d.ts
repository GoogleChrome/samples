declare const Gemma4ImageProcessor_base: new () => {
    (...args: any[]): any;
    _call(...args: any[]): any;
};
export class Gemma4ImageProcessor extends Gemma4ImageProcessor_base {
    /** @param {Record<string, any>} config */
    constructor(config: Record<string, any>);
    config: Record<string, any>;
    patch_size: any;
    max_soft_tokens: any;
    pooling_kernel_size: any;
    resample: any;
    rescale_factor: any;
    do_rescale: any;
    do_resize: any;
    do_convert_rgb: any;
    /**
     * @param {RawImage|RawImage[]} images
     * @returns {Promise<{ pixel_values: Tensor, image_position_ids: Tensor, num_soft_tokens_per_image: number[] }>}
     */
    _call(images: RawImage | RawImage[]): Promise<{
        pixel_values: Tensor;
        image_position_ids: Tensor;
        num_soft_tokens_per_image: number[];
    }>;
}
import { RawImage } from '../../utils/image.js';
import { Tensor } from '../../utils/tensor.js';
export {};
//# sourceMappingURL=image_processing_gemma4.d.ts.map