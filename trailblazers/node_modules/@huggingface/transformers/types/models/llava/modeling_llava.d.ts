export class LlavaPreTrainedModel extends PreTrainedModel {
}
/**
 * The LLAVA model which consists of a vision backbone and a language model.
 */
export class LlavaForConditionalGeneration extends LlavaPreTrainedModel {
    _merge_input_ids_with_image_features(kwargs: any): {
        inputs_embeds: any;
        attention_mask: any;
    };
}
export class Moondream1ForConditionalGeneration extends LlavaForConditionalGeneration {
}
export class LlavaQwen2ForCausalLM extends LlavaForConditionalGeneration {
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_llava.d.ts.map