/**
 * The Bloom Model transformer with a language modeling head on top (linear layer with weights tied to the input embeddings).
 */
export class BloomPreTrainedModel extends PreTrainedModel {
}
/**
 * The bare Bloom Model transformer outputting raw hidden-states without any specific head on top.
 */
export class BloomModel extends BloomPreTrainedModel {
}
/**
 * The Bloom Model transformer with a language modeling head on top (linear layer with weights tied to the input embeddings).
 */
export class BloomForCausalLM extends BloomPreTrainedModel {
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_bloom.d.ts.map