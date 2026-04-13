export class Florence2PreTrainedModel extends PreTrainedModel {
}
export class Florence2ForConditionalGeneration extends Florence2PreTrainedModel {
    _merge_input_ids_with_image_features({ inputs_embeds, image_features, input_ids, attention_mask }: {
        inputs_embeds: any;
        image_features: any;
        input_ids: any;
        attention_mask: any;
    }): {
        inputs_embeds: import("../../transformers.js").Tensor;
        attention_mask: import("../../transformers.js").Tensor;
    };
    _prepare_inputs_embeds({ input_ids, pixel_values, inputs_embeds, attention_mask }: {
        input_ids: any;
        pixel_values: any;
        inputs_embeds: any;
        attention_mask: any;
    }): Promise<{
        inputs_embeds: any;
        attention_mask: any;
    }>;
    forward({ input_ids, pixel_values, attention_mask, decoder_input_ids, decoder_attention_mask, encoder_outputs, past_key_values, inputs_embeds, decoder_inputs_embeds, }: {
        input_ids: any;
        pixel_values: any;
        attention_mask: any;
        decoder_input_ids: any;
        decoder_attention_mask: any;
        encoder_outputs: any;
        past_key_values: any;
        inputs_embeds: any;
        decoder_inputs_embeds: any;
    }): Promise<any>;
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_florence2.d.ts.map