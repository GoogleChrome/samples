export class UltravoxPreTrainedModel extends PreTrainedModel {
}
export class UltravoxModel extends UltravoxPreTrainedModel {
    _merge_input_ids_with_audio_features(kwargs: any): {
        inputs_embeds: any;
        attention_mask: any;
    };
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_ultravox.d.ts.map