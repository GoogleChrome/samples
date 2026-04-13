export class Qwen2VLPreTrainedModel extends PreTrainedModel {
}
export class Qwen2VLForConditionalGeneration extends Qwen2VLPreTrainedModel {
    image_grid_thw_name: string;
    /**
     * Compute text-only 3D rope position IDs (all 3 dims get the same 1D positions).
     * @param {Tensor} input_ids
     * @param {Tensor} attention_mask
     * @returns {[Tensor, Tensor]} [position_ids, mrope_position_deltas]
     */
    _get_text_only_rope_index(input_ids: Tensor, attention_mask: Tensor): [Tensor, Tensor];
    /**
     * Reorder per-segment position ID lists from [seg1[t,h,w], seg2[t,h,w], ...] into
     * global [all_t, all_h, all_w] order, then write back into the position_ids array
     * respecting attention mask.
     * @param {number[][]} llm_pos_ids_list List of per-segment position arrays, each of length 3*seg_len
     * @param {number[]} attn_mask Attention mask for this batch element
     * @param {number[][][]} position_ids_list [3][batch][seq] output array to write into
     * @param {number} batch_idx Current batch index
     * @returns {number[]} Flat reordered positions of length total_len
     */
    _reorder_and_write_positions(llm_pos_ids_list: number[][], attn_mask: number[], position_ids_list: number[][][], batch_idx: number): number[];
    /**
     * Build per-batch position ID segments for multimodal rope.
     * Override this in subclasses to change how vision/text segments are identified and positioned.
     * @param {object} params
     * @param {any[]} params.filtered_ids - attention-masked token IDs for this batch element
     * @param {any[][]} params.image_grid_thw_list - all image grid dimensions
     * @param {any[][]} params.video_grid_thw_list - all video grid dimensions
     * @param {number} params.spatial_merge_size
     * @param {{image_index: number, video_index: number}} params.state - mutable counters shared across batches
     * @returns {number[][]} llm_pos_ids_list - segments of [t..., h..., w...] positions
     */
    _get_multimodal_rope_positions({ filtered_ids, image_grid_thw_list, video_grid_thw_list, spatial_merge_size, state, }: {
        filtered_ids: any[];
        image_grid_thw_list: any[][];
        video_grid_thw_list: any[][];
        spatial_merge_size: number;
        state: {
            image_index: number;
            video_index: number;
        };
    }): number[][];
    /**
     * Calculate the 3D rope index based on image and video's temporal, height and width in LLM.
     *
     * Explanation:
     *     Each embedding sequence contains vision embedding and text embedding or just contains text embedding.
     *
     *     For pure text embedding sequence, the rotary position embedding has no difference with mordern LLMs.
     *     Examples:
     *         input_ids: [T T T T T], here T is for text.
     *         temporal position_ids: [0, 1, 2, 3, 4]
     *         height position_ids: [0, 1, 2, 3, 4]
     *         width position_ids: [0, 1, 2, 3, 4]
     *
     *     For vision and text embedding sequence, we calculate 3D rotary position embedding for vision part
     *     and 1D rotary position embeddin for text part.
     *     Examples:
     *         Assume we have a video input with 3 temporal patches, 2 height patches and 2 width patches.
     *         input_ids: [V V V V V V V V V V V V T T T T T], here V is for vision.
     *         vision temporal position_ids: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2]
     *         vision height position_ids: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
     *         vision width position_ids: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
     *         text temporal position_ids: [3, 4, 5, 6, 7]
     *         text height position_ids: [3, 4, 5, 6, 7]
     *         text width position_ids: [3, 4, 5, 6, 7]
     *         Here we calculate the text start position_ids as the max vision position_ids plus 1.
     *
     * @param {Tensor} input_ids Indices of input sequence tokens in the vocabulary. Tensor of shape `(batch_size, sequence_length)`.
     * @param {Tensor} image_grid_thw (Optional) The temporal, height and width of feature shape of each image in LLM. Tensor of shape `(num_images, 3)`.
     * @param {Tensor} video_grid_thw (Optional) The temporal, height and width of feature shape of each video in LLM. Tensor of shape `(num_videos, 3)`.
     * @param {Tensor} attention_mask (Optional) Mask to avoid performing attention on padding token indices. Tensor of shape `(batch_size, sequence_length)`.
     * @returns {[Tensor, Tensor]} [position_ids, mrope_position_deltas]
     */
    get_rope_index(input_ids: Tensor, image_grid_thw: Tensor, video_grid_thw: Tensor, attention_mask: Tensor): [Tensor, Tensor];
    encode_image({ pixel_values, image_grid_thw }: {
        pixel_values: any;
        image_grid_thw: any;
    }): Promise<any>;
    _merge_input_ids_with_image_features(kwargs: any): {
        inputs_embeds: any;
        attention_mask: any;
    };
    prepare_inputs_for_generation(input_ids: any, model_inputs: any, generation_config: any): any;
}
export class Qwen2VLForCausalLM extends Qwen2VLForConditionalGeneration {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=modeling_qwen2_vl.d.ts.map