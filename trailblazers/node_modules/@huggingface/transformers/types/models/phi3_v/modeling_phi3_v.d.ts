export class Phi3VPreTrainedModel extends PreTrainedModel {
}
export class Phi3VForCausalLM extends Phi3VPreTrainedModel {
    forward({ input_ids, attention_mask, pixel_values, image_sizes, position_ids, inputs_embeds, past_key_values, generation_config, logits_processor, ...kwargs }: {
        [x: string]: any;
        input_ids?: any;
        attention_mask?: any;
        pixel_values?: any;
        image_sizes?: any;
        position_ids?: any;
        inputs_embeds?: any;
        past_key_values?: any;
        generation_config?: any;
        logits_processor?: any;
    }): Promise<any>;
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_phi3_v.d.ts.map