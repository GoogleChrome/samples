export class Qwen2VLImageProcessor extends ImageProcessor {
    constructor(config: any);
    patch_size: any;
    merge_size: any;
    _call(images: any, ...args: any[]): Promise<{
        pixel_values: Tensor;
        image_grid_thw: Tensor;
        original_sizes: import("../../image_processors_utils.js").HeightWidth[];
        reshaped_input_sizes: import("../../image_processors_utils.js").HeightWidth[];
    }>;
}
import { ImageProcessor } from '../../image_processors_utils.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=image_processing_qwen2_vl.d.ts.map