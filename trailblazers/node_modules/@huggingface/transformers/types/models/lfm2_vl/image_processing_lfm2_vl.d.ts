export class Lfm2VlImageProcessor extends ImageProcessor {
    constructor(config: Record<string, any>);
    downsample_factor: any;
    do_image_splitting: any;
    min_tiles: any;
    max_tiles: any;
    use_thumbnail: any;
    min_image_tokens: any;
    max_image_tokens: any;
    encoder_patch_size: any;
    tile_size: any;
    max_pixels_tolerance: any;
    return_row_col_info: any;
    max_num_patches: number;
    /**
     * Check if the image is too large to be processed as a single tile.
     * @param {number} height
     * @param {number} width
     * @returns {boolean}
     */
    _is_image_too_large(height: number, width: number): boolean;
    /**
     * Get the grid layout for tiling a large image.
     * @param {number} height
     * @param {number} width
     * @returns {{ grid_width: number, grid_height: number, target_width: number, target_height: number }}
     */
    _get_grid_layout(height: number, width: number): {
        grid_width: number;
        grid_height: number;
        target_width: number;
        target_height: number;
    };
    /** @param {RawImage|RawImage[]|RawImage[][]} images */
    _call(images: RawImage | RawImage[] | RawImage[][], { return_row_col_info }?: {
        return_row_col_info?: any;
    }): Promise<Record<string, any>>;
}
export type RawImage = import("../../utils/image.js").RawImage;
import { ImageProcessor } from '../../image_processors_utils.js';
//# sourceMappingURL=image_processing_lfm2_vl.d.ts.map