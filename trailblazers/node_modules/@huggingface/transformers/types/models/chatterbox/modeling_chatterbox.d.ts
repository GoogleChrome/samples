export class ChatterboxPreTrainedModel extends PreTrainedModel {
    _return_dict_in_generate_keys: string[];
}
export class ChatterboxModel extends ChatterboxPreTrainedModel {
    /**
     * @param {Tensor} audio_values
     * @returns {Promise<{audio_features: Tensor, audio_tokens: Tensor, speaker_embeddings: Tensor, speaker_features: Tensor}>}
     */
    encode_speech(audio_values: Tensor): Promise<{
        audio_features: Tensor;
        audio_tokens: Tensor;
        speaker_embeddings: Tensor;
        speaker_features: Tensor;
    }>;
    forward({ input_ids, attention_mask, audio_values, exaggeration, position_ids, inputs_embeds, past_key_values, generation_config, logits_processor, audio_features, audio_tokens, speaker_embeddings, speaker_features, ...kwargs }: {
        [x: string]: any;
        input_ids?: any;
        attention_mask?: any;
        audio_values?: any;
        exaggeration?: any;
        position_ids?: any;
        inputs_embeds?: any;
        past_key_values?: any;
        generation_config?: any;
        logits_processor?: any;
        audio_features?: any;
        audio_tokens?: any;
        speaker_embeddings?: any;
        speaker_features?: any;
    }): Promise<any>;
    prepare_inputs_for_generation(input_ids: any, model_inputs: any, generation_config: any): any;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=modeling_chatterbox.d.ts.map