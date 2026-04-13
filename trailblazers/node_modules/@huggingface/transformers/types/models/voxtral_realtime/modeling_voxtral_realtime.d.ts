export class VoxtralRealtimePreTrainedModel extends PreTrainedModel {
}
export class VoxtralRealtimeForConditionalGeneration extends VoxtralRealtimePreTrainedModel {
    forward({ input_ids, past_key_values, ...kwargs }: {
        [x: string]: any;
        input_ids: any;
        past_key_values: any;
    }): Promise<any>;
    generate({ input_features, stopping_criteria: userStoppingCriteria, ...kwargs }: {
        [x: string]: any;
        input_features: any;
        stopping_criteria: any;
    }): Promise<Tensor | import("../modeling_outputs.js").ModelOutput>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { Tensor } from '../../utils/tensor.js';
//# sourceMappingURL=modeling_voxtral_realtime.d.ts.map