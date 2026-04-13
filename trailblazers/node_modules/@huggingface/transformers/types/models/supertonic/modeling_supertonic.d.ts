export class SupertonicPreTrainedModel extends PreTrainedModel {
}
export class SupertonicForConditionalGeneration extends SupertonicPreTrainedModel {
    generate_speech({ input_ids, attention_mask, style, num_inference_steps, speed, }: {
        input_ids: any;
        attention_mask: any;
        style: any;
        num_inference_steps?: number;
        speed?: number;
    }): Promise<{
        waveform: any;
        durations: any;
    }>;
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_supertonic.d.ts.map