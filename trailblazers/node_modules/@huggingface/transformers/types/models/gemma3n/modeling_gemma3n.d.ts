export class Gemma3nPreTrainedModel extends PreTrainedModel {
}
export class Gemma3nForConditionalGeneration extends Gemma3nPreTrainedModel {
    forward({ input_ids, attention_mask, pixel_values, input_features, input_features_mask, position_ids, inputs_embeds, per_layer_inputs, past_key_values, generation_config, logits_processor, ...kwargs }: {
        [x: string]: any;
        input_ids?: any;
        attention_mask?: any;
        pixel_values?: any;
        input_features?: any;
        input_features_mask?: any;
        position_ids?: any;
        inputs_embeds?: any;
        per_layer_inputs?: any;
        past_key_values?: any;
        generation_config?: any;
        logits_processor?: any;
    }): Promise<any>;
    _encode_vision(kwargs: any): Promise<any>;
    _merge_input_ids_with_image_features(kwargs: any): {
        inputs_embeds: any;
        attention_mask: any;
    };
    _merge_input_ids_with_audio_features(kwargs: any): {
        inputs_embeds: any;
        attention_mask: any;
    };
}
export class Gemma3nForCausalLM extends Gemma3nForConditionalGeneration {
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_gemma3n.d.ts.map