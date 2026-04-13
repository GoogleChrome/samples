export class MoonshinePreTrainedModel extends PreTrainedModel {
    requires_attention_mask: boolean;
}
/**
 * MoonshineModel class for training Moonshine models without a language model head.
 */
export class MoonshineModel extends MoonshinePreTrainedModel {
}
export class MoonshineForConditionalGeneration extends MoonshinePreTrainedModel {
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_moonshine.d.ts.map