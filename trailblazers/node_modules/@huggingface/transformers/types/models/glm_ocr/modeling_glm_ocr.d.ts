export class GlmOcrForConditionalGeneration extends Qwen2_5_VLForConditionalGeneration {
    /**
     * Compute 3D positional indices for vision tokens.
     * Temporal is constant, height is repeat-interleaved, width tiles.
     * @param {number} start_position
     * @param {number[]} grid_thw [T, H, W]
     * @param {number} temp_merge_size
     * @param {number} spatial_merge_size
     * @returns {number[]} Flat array of length 3 * seq_len: [temporal..., height..., width...]
     */
    get_vision_position_ids(start_position: number, grid_thw: number[], temp_merge_size: number, spatial_merge_size: number): number[];
    /**
     * GlmOcr uses mm_token_type_ids-style grouping (image tokens identified by image_token_id)
     * instead of vision_start_token_id scanning used by Qwen2VL.
     * After a vision segment, position advances by max(h, w) / spatial_merge_size.
     */
    _get_multimodal_rope_positions({ filtered_ids, image_grid_thw_list, video_grid_thw_list, spatial_merge_size, state, }: {
        filtered_ids: any;
        image_grid_thw_list: any;
        video_grid_thw_list: any;
        spatial_merge_size: any;
        state: any;
    }): number[][];
}
import { Qwen2_5_VLForConditionalGeneration } from '../qwen2_5_vl/modeling_qwen2_5_vl.js';
//# sourceMappingURL=modeling_glm_ocr.d.ts.map